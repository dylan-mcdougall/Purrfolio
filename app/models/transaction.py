from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float(2), nullable=False)
    buy = db.Column(db.Boolean, nullable=False)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    portfolio = db.relationship("Portfolio", back_populates="transactions", cascade="all, delete-orphan", single_parent=True)
    stock = db.relationship("Stock", back_populates="transactions")

    def to_dict(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "price": self.price,
            "buy": self.buy,
            "portfolio_id": self.portfolio_id,
            "stock_id": self.stock_id,
            "created_at": self.created_at,
            "last_modified": self.last_modified
        }
