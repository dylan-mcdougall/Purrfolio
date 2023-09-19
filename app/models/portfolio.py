from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from .user import User
from .transaction import Transaction
from .portfolio_stock import PortfolioStock

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    current_funds = db.Column(db.Float(2), nullable=False)
    fund_history = db.Column(db.Float(2))
    user_id = db.Column(db.Integer, ForeignKey(User.id), nullable=False)
