import asyncio
from models import Order
from config.config import db
import os


pw_threads_qtty = int(os.getenv("pw_threads_qtty"))
semaphore = asyncio.Semaphore(pw_threads_qtty)
processing_orders = []

async def process_order(order):
    async with semaphore:
        if  order.id not in processing_orders:
            processing_orders.append(order.id)
            asyncio.sleep(10) # stub
            order.status = 'completed'
            db.session.commit()


async def processing_worker():
    while True:
        orders = Order.query.filter_by(status="processing").all()

        for order in orders:
            processing_orders.append(order.id)
            asyncio.create_task(process_order(order))

