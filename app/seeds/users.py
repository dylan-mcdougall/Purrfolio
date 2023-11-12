from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_users():
    demo = User(
        first_name='Justin', last_name='Thyme', username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        first_name='Chris P.', last_name='Bacon', username='Chris P.', email='chris@aa.io', password='password')
    bobbie = User(
        first_name='Anita', last_name='Job', username='Anita', email='anita@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()



def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
