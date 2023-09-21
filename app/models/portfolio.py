from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from datetime import datetime

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    current_funds = db.Column(db.Float(2), nullable=False)
    fund_history = db.Column(db.Float(2))
    user_id = db.Column(db.Integer, ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="portfolio")
    stocks = db.relationship("PortfolioStock", back_populates="portfolio")
    transactions = db.relationship("Transaction", back_populates="portfolio")
