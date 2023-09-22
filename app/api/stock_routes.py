from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Portfolio, Stock

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
