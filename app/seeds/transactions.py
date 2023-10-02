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
    third = Transaction(
        portfolio_id=1, stock_id=100, quantity=20, price=7.825, buy=True
    )
    fourth = Transaction(
        portfolio_id=1, stock_id=1, quantity=10, price=8.91, buy=True
    )
    fifth = Transaction(
        portfolio_id=1, stock_id=5, quantity=13, price=35.18, buy=True
    )
    sixth = Transaction(
        portfolio_id=1, stock_id=27, quantity=3, price=80.12, buy=True
    )

    db.session.add(first)
    db.session.add(second)
    db.session.add(third)
    db.session.add(fourth)
    db.session.add(fifth)
    db.session.add(sixth)
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
        
    db.session.commit()
