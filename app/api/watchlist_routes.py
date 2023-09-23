from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import login_required, current_user
from app.models import User, Stock, Watchlist, db, WatchlistStock
from .auth_routes import authenticate

watchlist_routes = Blueprint('watchlists', __name__)

@watchlist_routes.route('/new', methods=["POST"])
@login_required
def new_watchlist():
    """
    Route for a user to create a new watchlist
    """
    res = authenticate()
    if res.get('errors'):
        return res
    new_list = Watchlist(user_id=res['id'])
    db.session.add(new_list)
    db.session.commit()
    return new_list.to_dict()

@watchlist_routes.route('/<int:id>/add-by-id', methods=["POST"])
@login_required
def add_to_list(id):
    """
    Route to add a stock to a watchlist by stock id
    """
    res = authenticate()
    watchlist = Watchlist.query.get(id)
    data = request.json
    stock = data.get('stock_id')
    if res['id'] == watchlist.user_id:
        if Stock.query.filter(Stock.id==stock).first():
            payload = WatchlistStock(
            watchlist_id=id, stock_id=stock
            )
            db.session.add(payload)
            db.session.commit()
            return payload.to_dict()
        return {"errors": "Invalid stock id in request body"}
    return {'errors': ['Unauthorized']}
        
@watchlist_routes.route('/<int:id>/add-by-ticker', methods=["POST"])
@login_required
def add_ticker_to_list(id):
    """
    Route to add a stock to a watchlist by ticker
    """
    res = authenticate()
    watchlist = Watchlist.query.options(joinedload(Watchlist.stocks)).get(id)
    data = request.json
    stock = data.get('ticker')
    if res['id'] == watchlist.user_id:
        target_stock = Stock.query.filter(Stock.ticker==stock).first()
        watchlist_stocks = [stock.to_dict() for stock in watchlist.stocks]
        stock_ids = [stock['stock_id'] for stock in watchlist_stocks]
        if target_stock.id in stock_ids:
            return {"errors": "Stock is already in this watchlist"}
        if target_stock.ticker == stock:
            target_stock_dict = target_stock.to_dict()
            payload = WatchlistStock(
            watchlist_id=id, stock_id=target_stock_dict['id']
            )
            db.session.add(payload)
            db.session.commit()
            return payload.to_dict()
        return {"errors": "Invalid stock ticker in request body"}
    return {'errors': ['Unauthorized']}
