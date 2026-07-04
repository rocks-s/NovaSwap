import asyncio
from models import Order
from services.transfer_checkers.main import check_transfer
from config.config import db
import os


ww_threads_qtty = int(os.getenv("ww_threads_qtty"))
semaphore = asyncio.Semaphore(ww_threads_qtty)
delay = int(os.getenv("ww_check_delay")) # seconds

async def process_order(order):
    async with semaphore:
        transfer = check_transfer(order.id)
        received, error = transfer.values()
        if received:
            order.status = 'processing'
            db.session.commit()


async def waiting_worker():
    while True:
        orders = Order.query.filter_by(status="waiting").all()

        for order in orders:
            asyncio.create_task(process_order(order))

        asyncio.sleep(delay)
        
