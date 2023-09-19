from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey
from .user import User
from .stock import Stock

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40))
    user_id = db.Column(db.Integer, ForeignKey(User.id), nullable=False)
    stock_id = db.Column(db.Integer, ForeignKey(Stock.id))
