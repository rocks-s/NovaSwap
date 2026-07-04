from models import Order
from config.config import db
from datetime import datetime, timedelta, timezone


import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "config", ".env"))

order_lifetime = int(os.getenv("order_lifetime")) # minutes

def is_expired(order):
    return datetime.now(timezone.utc) > (
        datetime.fromisoformat(order.details['createdAt'])
          + timedelta(minutes=order_lifetime)
    )

def get_active_order(order_id):
    order = Order.query.filter_by(id=order_id).first()

    if not order:
        return None

    if is_expired(order):
        order.status = "expired"
        db.session.commit()
        return None
    
    return order