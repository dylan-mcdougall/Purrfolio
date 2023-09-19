from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship

class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    ticker = db.Column(db.String(5), nullable=False, unique=True)
    price = db.Column(db.Float(2), nullable=False)
    open = db.Column(db.Float(2), nullable=False)
    close = db.Column(db.Float(2), nullable=False)
    high = db.Column(db.Float(2), nullable=False)
    low = db.Column(db.Float(2), nullable=False)
    volume = db.Column(db.Integer, nullable=False)

    portfolios = db.relationship("PortfolioStock", back_populates="stock")
    transactions = db.relationship("Transaction", back_populates="stock")
    watchlists = db.relationship("WatchlistStock", back_populates="stock")
