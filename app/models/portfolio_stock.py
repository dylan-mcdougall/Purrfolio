from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey


class PortfolioStock(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    portfolio_id = db.Column(db.Integer, ForeignKey("portfolios.id"), nullable=False)
    stock_id = db.Column(db.Integer, ForeignKey("stocks.id"), nullable=False)

    portfolio = db.relationship("Portfolio", back_populates="stocks")
    stock = db.relationship("Stock", back_populates="portfolios")