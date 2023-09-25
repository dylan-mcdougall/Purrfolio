from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import login_required, current_user
from app.models import User, Stock, Watchlist, db, WatchlistStock
from .auth_routes import authenticate
from .fetch_logic import fetch_watchlist_stocks

watchlist_routes = Blueprint('watchlists', __name__)

@watchlist_routes.route('/new', methods=["POST"])
@login_required
def new_watchlist():
    """
    Route for a user to create a new watchlist
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    new_list = Watchlist(user_id=res['id'])
    db.session.add(new_list)
    db.session.commit()
    return new_list.to_dict()

@watchlist_routes.route('/<int:id>', methods=["PATCH"])
@login_required
def update_name(id):
    """
    Route to enable a user to update their watchlist name
    """
    # Authenticate current user exists and owns desired list
    res = authenticate()
    if res.get('errors'):
        return res, 401
    target = Watchlist.query.get(id)
    if target == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    if target.user_id != res['id']:
        return {"errors": ["Unauthorized"]}, 403
    # Authenticate proper body exists
    data = request.json
    if not data.get('name'):
        return {"errors": ["Please provide desired name in request body"]}, 400
    target.name = data.get('name')
    db.session.commit()
    return {"message": "Watchlist name updated successfully"}

@watchlist_routes.route('/<int:id>')
@login_required
def single_list(id):
    """
    Route to return a individual watchlist
    """
    # Authenticate current user exists and owns desired list
    res = authenticate()
    if res.get('errors'):
        return res, 401
    target = Watchlist.query.get(id)
    if target == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    target = target.to_dict()
    if target['user_id'] != res['id']:
        return {"errors": ["Unauthorized"]}, 403
    # Implement fetch logic
    target['stocks'] = fetch_watchlist_stocks(target['id'])
    return target

@watchlist_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_list(id):
    """
    Route to allow a user to delete a watchlist they posess
    """
    # Authenticate current user exists and owns desired list
    res = authenticate()
    if res.get('errors'):
        return res, 401
    target = Watchlist.query.get(id)
    if target == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    if target.user_id != res['id']:
        return {"errors": ["Unauthorized"]}, 403
    # Implement deletion
    db.session.delete(target)
    db.session.commit()
    return {"message": "Watchlist successfully deleted"}

@watchlist_routes.route('/<int:id>/add-by-id', methods=["POST"])
@login_required
def add_to_list(id):
    """
    Route to add a stock to a watchlist by stock id
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    watchlist = Watchlist.query.get(id)
    if watchlist == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    data = request.json
    stock = data.get('stock_id')
    if stock == None:
        return {"errors": ["Please ensure stock_id is properly passed in request JSON"]}
    if res['id'] == watchlist.user_id:
        if Stock.query.filter(Stock.id==stock).first():
            payload = WatchlistStock(
            watchlist_id=id, stock_id=stock
            )
            db.session.add(payload)
            db.session.commit()
            return payload.to_dict()
        return {"errors": "Invalid stock id in request body"}, 400
    return {'errors': ['Unauthorized']}, 403
        
@watchlist_routes.route('/<int:id>/add-by-ticker', methods=["POST"])
@login_required
def add_ticker_to_list(id):
    """
    Route to add a stock to a watchlist by ticker
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    watchlist = Watchlist.query.options(joinedload(Watchlist.stocks)).get(id)
    if watchlist == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    data = request.json
    stock = data.get('ticker')
    if stock == None:
        return {"errors": ["Please ensure stock ticker is properly passed in request JSON"]}, 400
    if res['id'] == watchlist.user_id:
        target_stock = Stock.query.filter(Stock.ticker==stock).first()
        if target_stock == None:
            return {"errors": ["Stock associated with this ticker does not exist"]}, 404
        watchlist_stocks = [stock.to_dict() for stock in watchlist.stocks]
        stock_ids = [stock['stock_id'] for stock in watchlist_stocks]
        if target_stock.id in stock_ids:
            return {"errors": "Stock is already in this watchlist"}, 400
        if target_stock.ticker == stock:
            target_stock_dict = target_stock.to_dict()
            payload = WatchlistStock(
            watchlist_id=id, stock_id=target_stock_dict['id']
            )
            db.session.add(payload)
            db.session.commit()
            return payload.to_dict()
        return {"errors": "Invalid stock ticker in request body"}, 400
    return {'errors': ['Unauthorized']}, 403

@watchlist_routes.route('/<int:id>/remove-stock', methods=["DELETE"])
@login_required
def removed_stock(id):
    # Authenticate current user exists and owns desired list
    res = authenticate()
    if res.get('errors'):
        return res, 401
    target = Watchlist.query.options(joinedload(Watchlist.stocks)).get(id)
    if target == None:
        return {"errors": ["Watchlist associated with this id does not exist"]}, 404
    if target.user_id != res['id']:
        return {"errors": ["Unauthorized"]}, 403
    # Authenticate request data and fetch logic
    data = request.json
    if not data['stock_id']:
        return {"errors": ["Please include the target stock_id in the request body"]}, 400
    watchlist_stocks = [stock.to_dict() for stock in target.stocks]
    if not watchlist_stocks:
        return {"errors": ["Watchlist does not have any stocks to delete"]}, 400
    stock_ids = [stock['stock_id'] for stock in watchlist_stocks]
    if int(data['stock_id']) not in stock_ids:
        return {"errors": ["Target stock does not exist in this watchlist"]}, 400
    watchlist_stock_target = WatchlistStock.query.filter(WatchlistStock.stock_id == int(data['stock_id'])).first()
    db.session.delete(watchlist_stock_target)
    db.session.commit()
    return {"message": "Stock successfully removed from Watchlist"}
