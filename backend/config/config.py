from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os


load_dotenv(dotenv_path=os.path.join(
    os.getcwd(), "config", ".env"))


app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


ORDER_STATUSES = ['waiting', 'processing', 'completed',
                   'expired', 'failed', 'canceled']