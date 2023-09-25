from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import login_required, current_user
from app.models import User, Portfolio, Stock, Transaction, db, PortfolioStock
from app.forms import UpdateFundsForm, TransactionForm
from .auth_routes import authenticate, validation_errors_to_error_messages
from .fetch_logic import fetch_portfolio_details

portfolio_routes = Blueprint('portfolios', __name__)

# Get queries

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

# Portfolio actions

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

# purchase and sell stocks
@portfolio_routes.route('/<int:id>/order', methods=["POST"])
@login_required
def portfolio_purchase(id):
    """
    Route to purchase a stock subject to available funds
    and quantity of stocks purchased
    """
    # Authentication that current user is owner of portfolio
    form = TransactionForm()
    portfolio = Portfolio.query.options(joinedload(Portfolio.stocks)).get(id)
    if not portfolio:
        return {"errors": "Portfolio associated with this id does not exist"}
    res = authenticate()
    if res['id'] != portfolio.user_id:
        return {"errors": ["Unauthorized"]}

    # Grab stock for validation
    funds = portfolio.current_funds
    stock = Stock.query.filter(Stock.ticker == form.data['ticker']).first()
    if stock is None:
        return {"errors": ["Stock not found"]}, 404
    portfolio_stock = PortfolioStock.query.filter(PortfolioStock.stock_id == stock.id).first()
    # Split logic for buying and selling
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if bool(form.data['buy']) == True:
            if funds < stock.price * form.data['quantity']:
                return {"errors": ["Insufficient funds"]}
            purchase = Transaction(
                quantity=form.data['quantity'], price=stock.price, buy=True,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            if not portfolio_stock:
                new_portfolio_stock = PortfolioStock(
                    quantity=form.data['quantity'], portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds - stock.price * form.data['quantity']
                db.session.add(purchase)
                db.session.add(portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            else:
                portfolio_stock.quantity = form.data['quantity'] + portfolio_stock.quantity
                portfolio.current_funds = funds - stock.price * form.data['quantity']
                db.session.add(purchase)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
        if bool(form.data['buy']) == False:
            stock_quantity = [s.to_dict() for s in portfolio.stocks if s.stock_id == stock.id]
            if not stock_quantity:
                return {"errors": ["Cannot sell more stocks than owned"]}
            if stock_quantity[0]['quantity'] < form.data['quantity']:
                return {"errors": ["Cannot sell more stocks than owned"]}
            if stock_quantity[0]['quantity'] == form.data['quantity']:
                transaction = Transaction(
                    quantity=form.data['quantity'], price=stock.price, buy=False,
                    portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds - stock.price * form.data['quantity']
                db.session.add(transaction)
                db.session.delete(portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            transaction = Transaction(
                quantity=form.data['quantity'], price=stock.price, buy=False,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            portfolio.current_funds = funds - stock.price * form.data['quantity']
            portfolio_stock.quantity = stock_quantity[0]['quantity'] - form.data['quantity']
            db.session.add(transaction)
            db.session.commit()
            return {"message": "Transaction completed successfully"}
    print(form.errors)
    return {"errors": ["Invalid form submission"]}


    