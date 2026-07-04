import asyncio
from services.workers.processing_worker import processing_worker
from services.workers.waiting_worker import waiting_worker


async def workers():
    
    asyncio.gather(processing_worker(), waiting_worker())


# asyncio.run(workers)