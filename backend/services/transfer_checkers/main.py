from services.transfer_checkers.evm import evm_transfer_check
from config.config import db
from sqlalchemy.orm.attributes import flag_modified
from models import Order, User


network_checkers = {
    "ETH": evm_transfer_check,
}


def check_transfer(order_id):
    order = Order.query.filter_by(id=order_id).first()
    user = User.query.filter_by(id=order.details['userId']).first()

    send_address = order.details['sendAddress']
    network = order.details['sendNetwork']
    token = order.details['sendCoin']
    send_amount = order.details['sendAmount']
    last_balance = user.addresses[network].get(
        'balances', {}).get(token)
    if last_balance is None:
        last_balance = 0
    
    answer = network_checkers[network](
        network, token, send_address,
        send_amount, last_balance)
    
    received, error = answer.values()
    if received:
        user.addresses[network]['balances'][token] = send_amount
        flag_modified(user, 'addresses')
        db.session.commit()
    return answer




