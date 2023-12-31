"""create tables for portfolio, portfolio_stock, stock, transaction, watchlist_stock, watchlist

Revision ID: 7f6b5728a3b6
Revises: ffdc0a98111c
Create Date: 2023-09-19 15:50:37.723057

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")



revision = '7f6b5728a3b6'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('ticker', sa.String(length=5), nullable=False),
    sa.Column('price', sa.Float(precision=2), nullable=False),
    sa.Column('open', sa.Float(precision=2), nullable=False),
    sa.Column('close', sa.Float(precision=2), nullable=False),
    sa.Column('high', sa.Float(precision=2), nullable=False),
    sa.Column('low', sa.Float(precision=2), nullable=False),
    sa.Column('volume', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('ticker')
    )
    op.create_table('portfolios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('current_funds', sa.Float(precision=2), nullable=False),
    sa.Column('fund_history', sa.Float(precision=2), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolio_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id']),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('price', sa.Float(precision=2), nullable=False),
    sa.Column('buy', sa.Boolean, nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id']),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlist_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id']),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id']),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")



def downgrade():
    op.drop_table('watchlist_stocks')
    op.drop_table('transactions')
    op.drop_table('portfolio_stocks')
    op.drop_table('watchlists')
    op.drop_table('portfolios')
    op.drop_table('stocks')
