from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from datetime import datetime

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    current_funds = db.Column(db.Float(2), default=0, nullable=False)
    fund_history = db.Column(db.Float(2), default=0)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="portfolio")
    stocks = db.relationship("PortfolioStock", back_populates="portfolio", cascade="all, delete")
    transactions = db.relationship("Transaction", back_populates="portfolio", cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "current_funds": self.current_funds,
            "fund_history": self.fund_history,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "last_modified": self.last_modified
        }
