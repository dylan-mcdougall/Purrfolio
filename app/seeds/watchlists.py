from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text

def seed_watchlists():
    demo = Watchlist(
        user_id=3
    )
    demo1 = Watchlist(
        user_id=3
    )
    marnie = Watchlist(
        name="Pretty Lists", user_id=2
    )

    db.session.add(demo)
    db.session.add(demo1)
    db.session.add(marnie)
    db.session.commit()

def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))
        
    db.session.commit()
