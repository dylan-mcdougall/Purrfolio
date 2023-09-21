from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Portfolio

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

