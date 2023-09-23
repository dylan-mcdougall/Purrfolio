from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_transactions():
    first = Transaction(
        portfolio_id=2, stock_id=100, quantity=20, price=7.77, buy=True 
    )
    second = Transaction(
        portfolio_id=2, stock_id=99, quantity=31, price=8.175, buy=True
    )

    db.session.add(first)
    db.session.add(second)
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
        
    db.session.commit()
