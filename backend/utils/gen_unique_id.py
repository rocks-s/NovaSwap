import uuid
def gen_unique_id(model, attr):
    id = str(uuid.uuid4().hex)[:8]
    while True:
        instance = model.query.filter(
            getattr(model, attr) == id
            ).first()
        if instance is None:
            break
        id = str(uuid.uuid4().hex)[:8]
    return id