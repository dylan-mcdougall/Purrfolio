from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Portfolio, Stock, Transaction, db
from app.forms import UpdateFundsForm
from .auth_routes import authenticate, validation_errors_to_error_messages
from .fetch_logic import fetch_portfolio_details

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
def portfolio_details(id):
    """
    Query a portfolio by id and returns that portfolio with expanded details
    """
    portfolio = fetch_portfolio_details(id)
    return jsonify({"portfolio": portfolio})

@portfolio_routes.route('/<int:id>/stocks')
@login_required
def portfolio_stocks(id):
    """
    Query for all of the stocks possessed by a given portfolio
    """
    portfolio = Portfolio.query.get(id)
    stocks = [stock.to_dict() for stock in portfolio.stocks]
    return jsonify({"stocks": stocks})

@portfolio_routes.route('/<int:id>/transactions')
@login_required
def portfolio_transactions(id):
    """
    Query for all of the transactions made by a given portfolio
    """
    portfolio = Portfolio.query.get(id)
    transactions = [transaction.to_dict() for transaction in portfolio.transactions]
    return jsonify({"transactions": transactions})

@portfolio_routes.route('/<int:id>/add-funds', methods=["PATCH"])
@login_required
def portfolio_funds(id):
    """
    Update a portfolios funds and return updated funds and fund purchase history
    """
    form = UpdateFundsForm()
    portfolio = Portfolio.query.get(id)
    res = authenticate()
    if res['id'] == portfolio.user_id:
        if form.data['funds'] < 10000000 and form.data['funds'] > 0:
            portfolio.current_funds += form.data['funds'] 
            portfolio.fund_history += form.data['funds']
            db.session.commit()
            return portfolio.to_dict()
        return { "errors": ["desired funds must be greater than 0 and less than 10,000,000"] }
    return {'errors': ['Unauthorized']}
