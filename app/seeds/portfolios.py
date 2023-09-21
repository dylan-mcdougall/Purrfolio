from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text

def seed_portfolios():
    demo = Portfolio(
        user_id=1, current_funds=0, fund_history=0
    )
    marnie = Portfolio(
        user_id=2, current_funds=100000.69, fund_history=230000
    )
    bobbie = Portfolio(
        user_id=3, current_funds=10000, fund_history=10000
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()

def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))
        
    db.session.commit()
