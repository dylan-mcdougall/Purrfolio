from app.models import db, WatchlistStock, environment, SCHEMA
from sqlalchemy.sql import text

def seed_watchlist_stocks():
    first = WatchlistStock(
        watchlist_id=3, stock_id=99
    )
    second = WatchlistStock(
        watchlist_id=3, stock_id=100
    )

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))
        
    db.session.commit()
