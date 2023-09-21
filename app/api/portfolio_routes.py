from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Portfolio, Stock

portfolio_routes = Blueprint('portfolios', __name__)

@portfolio_routes.route('/')
@login_required
def portfolios():
    """
    Query for all portfolios and return them in a list
    """
    portfolios = Portfolio.query.all()
    return {'portfolios': [portfolio.to_dict() for portfolio in portfolios]}

@portfolio_routes.route('/<int:id>')
@login_required
def portfolio(id):
    """
    Query a portfolio by id and returns that portfolio
    """
    portfolio = Portfolio.query.get(id)
    return portfolio.to_dict()

@portfolio_routes.route('/<int:id>/stocks')
@login_required
def portfolio_stocks(id):
    """
    Query for all of the stocks possessed by a given portfolio
    """
    portfolio = Portfolio.query.get(id)
    stocks = [stock.to_dict() for stock in portfolio.stocks]
    return jsonify({"stocks": stocks})

@portfolio_routes.route('/<int:id>/stock-valuation')
@login_required
def portfolio_stock_valuation(id):
    """
    Query to return the total value of assets owned by portfolio
    """
    portfolio = Portfolio.query.get(id)
    portfolio_stocks = [stock.to_dict() for stock in portfolio.stocks]
    stock_ids = [s['stock_id'] for s in portfolio_stocks]
    stocks = Stock.query.filter(Stock.id.in_(stock_ids)).all()
    stock_dict = {stock.id: stock for stock in stocks}

    value = 0
    for i in portfolio_stocks:
        stock = stock_dict.get(i['stock_id'])
        if stock:
            value += stock.price * i['quantity']
    return jsonify({"value": value})
