from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Portfolio, Stock
from .auth_routes import authenticate

stock_routes = Blueprint('stocks', __name__)

@stock_routes.route('/')
@login_required
def stocks():
    """
    Query for all existing stocks and return as a list of dicts
    """
    stocks = Stock.query.all()
    return {"stocks" : [stock.to_dict() for stock in stocks]}

@stock_routes.route('/<int:id>')
@login_required
def stock(id):
    """
    Query for a given stock and return it's details
    """
    stock = Stock.query.get(id)
    return stock.to_dict()

@stock_routes.route('/<string:ticker>')
@login_required
def stock_ticker(ticker):
    """
    Query for a given stock using it's ticker and return it's details
    """
    stock = Stock.query.filter(Stock.ticker==ticker).first()
    return stock.to_dict()

@stock_routes.route('/search')
@login_required
def stock_search():
    """
    Query to search a stock by name or by ticker
    """
    res = authenticate()
    if res.get('errors'):
        return res
    data = request.json
    query = data.get('query')
    if not query:
        return {"errors": ["Query was not properly sent in request JSON"]}
    stock_by_name = Stock.query.filter(Stock.name.ilike(f"%{query}%")).all()
    stock_by_ticker = Stock.query.filter(Stock.ticker.ilike(f"%{query}%")).all()

    name_dicts = []
    ticker_dicts = []

    if len(stock_by_name):
        name_dicts = [s.to_dict() for s in stock_by_name]
    if len(stock_by_ticker):
        ticker_dicts = [s.to_dict() for s in stock_by_ticker]
    
    combined_dicts = name_dicts + ticker_dicts
    unique_dicts = {d['id']: d for d in combined_dicts}.values()

    sorted_stocks = sorted(unique_dicts, key=lambda x: x['volume'], reverse=True)
    results = sorted_stocks[:10]

    return jsonify({"results": results})
