from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from .user import User
from .portfolio import Portfolio
from .stock import Stock

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float(2), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    portfolio_id = db.Column(db.Integer, ForeignKey(Portfolio.id), nullable=False)
    stock_id = db.Column(db.Integer, ForeignKey(Stock.id), nullable=False)
