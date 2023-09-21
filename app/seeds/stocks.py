from ..models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
from .stocks_fetch import stocks_fetch

def seed_stocks():
    stock_lst = stocks_fetch()
    stocks = [
        Stock(
            name=i['name'], ticker=i['ticker'], price=i['price'],
            open=i['open'], close=i['close'], high=i['high'], 
            low=i['low'], volume=i['volume']
        )
    for i in stock_lst
    ]
    for i in stocks:
        db.session.add(i)
    db.session.commit()

def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
        
    db.session.commit()
