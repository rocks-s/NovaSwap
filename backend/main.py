from flask import request, make_response, jsonify
from config.config import app, db
from sqlalchemy.orm.attributes import flag_modified
from models import User, Order
from utils.gen_unique_id import gen_unique_id
from utils.get_active_order import get_active_order
from services.user_addrs_controls.main import generate_address
import os
from datetime import datetime, timezone
import threading
from services.workers.main import workers
import asyncio


order_lifetime = int(os.getenv("order_lifetime"))


@app.route('/exchange', methods=['POST'])
def exchange_coins():
    user_id = request.cookies.get("user_id")
    raw_user = User.query.filter_by(
        public_id=user_id).first() if user_id else None

    if not user_id or not raw_user:
        user_id = gen_unique_id(User, "public_id")
        db.session.add(User(public_id=user_id))
        db.session.commit()

    user = User.query.filter_by(
        public_id=user_id).first()
    
    ( sendAmount, getAmount, sendCoin, getCoin, 
    sendNetwork, getNetwork, recAddress ) = request.json.values()

    if not user.addresses.get(sendNetwork):
        send_addr = generate_address(user.id, sendNetwork)
        user.addresses[sendNetwork] = {}
        user.addresses[sendNetwork]['address'] = send_addr
        flag_modified(user, "addresses")
        db.session.commit()

    send_addr = user.addresses[sendNetwork]['address']
    order_details = request.json | dict(
        sendAddress=send_addr, userId=user.id,
        createdAt=datetime.now(timezone.utc).replace(
            microsecond=0).isoformat(), expiresIn=order_lifetime
        )
    order_id = gen_unique_id(Order, "id")
    db.session.add(Order(id=order_id, details=order_details))
    user.orders = user.orders + [order_id]
    db.session.commit()
    
    resp = {"data": {"order_id": order_id}}
    response = make_response(jsonify(resp))

    if not request.cookies.get("user_id") or not raw_user:
        response.set_cookie(
            "user_id",
            user_id,
            httponly=True,
            samesite="Lax"
        )

    return response, 201


@app.route('/getOrder', methods=['GET'])
def get_order():
    order_id = request.args.get("id")
    if not order_id:
        return jsonify({"message": "id is required"}), 400
    order = get_active_order(order_id)
    if not order:
        return jsonify({"message": "order not found"}), 404 
    updateOrderStatus = getOrderStatusz() 
    return jsonify({'data': order.details | dict(status=order.status)}), 200


@app.route('/getOrderStatusz', methods=['GET'])
def getOrderStatusz():
    order_id = request.args.get("id")
    if not order_id:
        return jsonify({"message": "missing id param"}), 400
    order = get_active_order(order_id)
    if not order:
        return jsonify({"message": "order not found"}), 404
        
    if order.status == 'waiting':
        received = True
        if received:
            order.status = 'processing'
    elif order.status == 'processing':
        order.status = 'completed'
    elif order.status == 'completed':
        order.status = 'waiting'

    db.session.commit()
    return jsonify({'data': {'status': order.status}}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # threading.Thread(
    #     target=lambda:asyncio.run(workers()),
    #     daemon=True
    # ).start()
    app.run(debug=False)