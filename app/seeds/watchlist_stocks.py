from app.models import db, WatchlistStock, environment, SCHEMA
from sqlalchemy.sql import text

def seed_watchlist_stocks():
    first = WatchlistStock(
        watchlist_id=3, stock_id=99
    )
    second = WatchlistStock(
        watchlist_id=3, stock_id=100
    )
    third = WatchlistStock(
        watchlist_id=4, stock_id=30
    )
    fourth = WatchlistStock(
        watchlist_id=4, stock_id=22
    )
    fifth = WatchlistStock(
        watchlist_id=4, stock_id=85
    )
    db.session.add(first)
    db.session.add(second)
    db.session.add(third)
    db.session.add(fourth)
    db.session.add(fifth)
    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))
        
    db.session.commit()
