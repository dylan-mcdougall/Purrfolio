from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from .portfolio import Portfolio
from .stock import Stock

class PortfolioStock(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    portfolio_id = db.Column(db.Integer, ForeignKey(Portfolio.id), nullable=False)
    stock_id = db.Column(db.Integer, ForeignKey(Stock.id), nullable=False)
