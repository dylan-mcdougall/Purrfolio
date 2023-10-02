from app.models import db, PortfolioStock, environment, SCHEMA
from sqlalchemy.sql import text

def seed_portfolio_stocks():
    first = PortfolioStock(
        portfolio_id=2, stock_id=100, quantity=20
    )
    second = PortfolioStock(
        portfolio_id=2, stock_id=99, quantity=31
    )
    third = PortfolioStock(
        portfolio_id=1, stock_id=100, quantity=20
    )
    fourth = PortfolioStock(
        portfolio_id=1, stock_id=1, quantity=10
    )
    fifth = PortfolioStock(
        portfolio_id=1, stock_id=5, quantity=13
    )
    sixth = PortfolioStock(
        portfolio_id=1, stock_id=27, quantity=3
    )

    db.session.add(first)
    db.session.add(second)
    db.session.add(third)
    db.session.add(fourth)
    db.session.add(fifth)
    db.session.add(sixth)
    db.session.commit()

def undo_portfolio_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_stocks"))
        
    db.session.commit()
