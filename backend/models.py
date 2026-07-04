from config.config import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(8), unique=True)
    addresses = db.Column(db.JSON, default=dict)
    orders = db.Column(db.JSON, default=list)
    

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(8), primary_key=True)
    details = db.Column(db.JSON, default=dict)
    status = db.Column(db.String(20), default='waiting')

