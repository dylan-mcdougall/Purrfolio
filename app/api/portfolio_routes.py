from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import login_required
from app.models import Portfolio, Stock, Transaction, db, PortfolioStock
from app.forms import UpdateFundsForm
from .auth_routes import authenticate
from .fetch_logic import fetch_portfolio_details

portfolio_routes = Blueprint('portfolios', __name__)

# Get queries

@portfolio_routes.route('/')
@login_required
def portfolios():
    """
    Query for all portfolios and return them in a list
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolios = Portfolio.query.all()
    return {'portfolios': [portfolio.to_dict() for portfolio in portfolios]}

@portfolio_routes.route('/<int:id>')
@login_required
def portfolio_details(id):
    """
    Query a portfolio by id and returns that portfolio with expanded details
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = fetch_portfolio_details(id)
    return {"portfolio": portfolio}

@portfolio_routes.route('/<int:id>/stocks')
@login_required
def portfolio_stocks(id):
    """
    Query for all of the stocks possessed by a given portfolio
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.get(id)
    if portfolio == None:
        return {"errors": ["Portfolio associated with this id does not exist"]}, 404
    stocks = [stock.to_dict() for stock in portfolio.stocks]
    return {"stocks": stocks}

@portfolio_routes.route('/<int:id>/transactions')
@login_required
def portfolio_transactions(id):
    """
    Query for all of the transactions made by a given portfolio
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.get(id)
    if portfolio == None:
        return {"errors": ["Portfolio associated with this id does not exist"]}, 404
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
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.get(id)
    res = authenticate()
    if res['id'] == portfolio.user_id:
        if float(form.data['funds']) < 10000000 and float(form.data['funds']) > 0:
            portfolio.current_funds += float(form.data['funds'])
            portfolio.fund_history += float(form.data['funds'])
            db.session.commit()
            return portfolio.to_dict()
        return { "errors": ["desired funds must be greater than 0 and less than 10,000,000"] }
    if portfolio == None:
        return {"errors": ["Portfolio associated with this id does not exist"]}, 404
    if form.validate_on_submit():
        if res['id'] == portfolio.user_id:
            if float(form.data['funds']) < 10000000 and float(form.data['funds']) > 0:
                portfolio.current_funds += float(form.data['funds'])
                portfolio.fund_history += float(form.data['funds'])
                db.session.commit()
                return portfolio.to_dict()
            return { "errors": ["desired funds must be greater than 0 and less than 10,000,000"] }
        return {'errors': ['Unauthorized']}, 403
    return {"errors": ["Invalid form submission"]}, 400

# purchase and sell stocks
@portfolio_routes.route('/<int:id>/order/share', methods=["POST"])
@login_required
def portfolio_purchase_stock(id):
    """
    Route to purchase a stock subject to available funds
    and quantity of stocks purchased
    """
    # Authentication that current user is owner of portfolio
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.options(joinedload(Portfolio.stocks)).get(id)
    if not portfolio:
        return {"errors": ["Portfolio associated with this id does not exist"]}, 404
    if res['id'] != portfolio.user_id:
        return {"errors": ["Unauthorized"]}, 403
    # Grab stock for validation
    funds = portfolio.current_funds
    stock = Stock.query.filter(Stock.ticker == str.upper(request.json.get('ticker'))).first()
    if stock == None:
        return {"errors": ["Stock not found"]}, 404
    portfolio_stock = PortfolioStock.query.filter(PortfolioStock.stock_id == stock.id).first()
    # Split logic for buying and selling
    if request.json:
        if not request.json.get('ticker') or request.json.get('ticker') != str.upper(request.json.get('ticker')):
            return {"errors": ["Input data for stock ticker must be included and have all characters to Uppercase"]}
        if not request.json.get('quantity') or float(request.json.get('quantity')) <= 0:
            return {"errors": ["Input data for transaction quantity must be included and greater than 0"]}
        if bool(request.json.get('buy')) == True:
            if funds < stock.price * float(request.json.get('quantity')):
                return {"errors": ["Insufficient funds"]}, 400
            purchase = Transaction(
                quantity=float(request.json.get('quantity')), price=stock.price, buy=True,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            if portfolio_stock == None:
                new_portfolio_stock = PortfolioStock(
                    quantity=float(request.json.get('quantity')), portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds - stock.price * float(request.json.get('quantity'))
                db.session.add(purchase)
                db.session.add(new_portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            else:
                portfolio_stock.quantity = float(request.json.get('quantity')) + portfolio_stock.quantity
                portfolio.current_funds = funds - stock.price * float(request.json.get('quantity'))
                db.session.add(purchase)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
        if bool(request.json.get('buy')) == False:
            stock_quantity = [s.to_dict() for s in portfolio.stocks if s.stock_id == stock.id]
            if not stock_quantity:
                return {"errors": ["Cannot sell more stocks than owned"]}, 400
            if stock_quantity[0]['quantity'] < float(request.json.get('quantity')):
                return {"errors": ["Cannot sell more stocks than owned"]}, 400
            if stock_quantity[0]['quantity'] == float(request.json.get('quantity')):
                transaction = Transaction(
                    quantity=float(request.json.get('quantity')), price=stock.price, buy=False,
                    portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds + stock.price * float(request.json.get('quantity'))
                db.session.add(transaction)
                db.session.delete(portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            transaction = Transaction(
                quantity=float(request.json.get('quantity')), price=stock.price, buy=False,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            portfolio.current_funds = funds + stock.price * float(request.json.get('quantity'))
            portfolio_stock.quantity = stock_quantity[0]['quantity'] - float(request.json.get('quantity'))
            db.session.add(transaction)
            db.session.commit()
            return {"message": "Transaction completed successfully"}
    return {"errors": ["Invalid form submission"]}

# purchase and sell stocks by dollar amount
@portfolio_routes.route('/<int:id>/order/dollar', methods=["POST"])
@login_required
def portfolio_purchase_dollar(id):
    """
    Route to purchase a stock subject to available funds
    and quantity of stocks purchased
    """
    # Authentication that current user is owner of portfolio
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.options(joinedload(Portfolio.stocks)).get(id)
    if not portfolio:
        return {"errors": ["Portfolio associated with this id does not exist"]}, 404
    if res['id'] != portfolio.user_id:
        return {"errors": ["Unauthorized"]}, 403

    # Grab stock for validation
    funds = portfolio.current_funds
    stock = Stock.query.filter(Stock.ticker == str.upper(request.json.get('ticker'))).first()
    if stock == None:
        return {"errors": ["Stock not found"]}, 404
    portfolio_stock = PortfolioStock.query.filter(PortfolioStock.stock_id == stock.id).first()
    # Split logic for buying and selling
    if request.json:
        if not request.json.get('ticker') or request.json.get('ticker') != str.upper(request.json.get('ticker')):
            return {"errors": ["Input data for stock ticker must be included and have all characters to Uppercase"]}
        if not request.json.get('quantity') or float(request.json.get('quantity')) <= 0:
            return {"errors": ["Input data for transaction quantity must be included and greater than 0"]}
        if bool(request.json.get('buy')) == True:
            if funds < float(request.json.get('quantity')):
                return {"errors": ["Insufficient funds"]}, 400
            purchase = Transaction(
                quantity=float(request.json.get('quantity')) / stock.price, price=stock.price, buy=True,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            if portfolio_stock == None:
                new_portfolio_stock = PortfolioStock(
                    quantity=float(request.json.get('quantity')) / stock.price, portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds - float(request.json.get('quantity'))
                db.session.add(purchase)
                db.session.add(new_portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            else:
                portfolio_stock.quantity = (float(request.json.get('quantity')) / stock.price) + portfolio_stock.quantity
                portfolio.current_funds = funds - float(request.json.get('quantity'))
                db.session.add(purchase)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
        if bool(request.json.get('buy')) == False:
            stock_quantity = [s.to_dict() for s in portfolio.stocks if s.stock_id == stock.id]
            if not stock_quantity:
                return {"errors": ["Cannot sell more stocks than owned"]}, 400
            if stock_quantity[0]['quantity'] < (float(request.json.get('quantity')) / stock.price):
                return {"errors": ["Cannot sell more stocks than owned"]}, 400
            if stock_quantity[0]['quantity'] == (float(request.json.get('quantity')) / stock.price):
                transaction = Transaction(
                    quantity=(float(request.json.get('quantity')) / stock.price), price=stock.price, buy=False,
                    portfolio_id=portfolio.id, stock_id=stock.id
                )
                portfolio.current_funds = funds + float(request.json.get('quantity'))
                db.session.add(transaction)
                db.session.delete(portfolio_stock)
                db.session.commit()
                return {"message": "Transaction completed successfully"}
            transaction = Transaction(
                quantity=(float(request.json.get('quantity')) / stock.price), price=stock.price, buy=False,
                portfolio_id=portfolio.id, stock_id=stock.id
            )
            portfolio.current_funds = funds + float(request.json.get('quantity'))
            portfolio_stock.quantity = stock_quantity[0]['quantity'] - (float(request.json.get('quantity')) / stock.price)
            db.session.add(transaction)
            db.session.commit()
            return {"message": "Transaction completed successfully"}
    return {"errors": ["Invalid form submission"]}
