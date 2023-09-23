from app.models import User, Portfolio, Stock, Transaction, db, Watchlist

def fetch_portfolio_details(id):
    value = 0

    portfolio = Portfolio.query.get(id)
    portfolio_dict = portfolio.to_dict()

    portfolio_stocks = [stock.to_dict() for stock in portfolio.stocks]
    if portfolio_stocks:
        portfolio_dict['stocks'] = portfolio_stocks
        stock_ids = [s['stock_id'] for s in portfolio_stocks]
        stocks = Stock.query.filter(Stock.id.in_(stock_ids)).all()
        stock_dict = {stock.id: stock for stock in stocks}

        
        for i in portfolio_stocks:
            stock = stock_dict.get(i['stock_id'])
            if stock:
                value += stock.price * i['quantity']
    else:
        portfolio_dict['stocks'] = []
    portfolio_dict['stock_valuation'] = value
    portfolio_dict['total_valuation'] = value + portfolio_dict['current_funds']

    transactions = [transaction.to_dict() for transaction in portfolio.transactions]
    if transactions:
        portfolio_dict['transactions'] = transactions
    else:
        portfolio_dict['transactions'] = []
    user = portfolio.user.to_dict()
    portfolio_dict['user'] = user

    return portfolio_dict

def fetch_watchlist_stocks(id):
    watchlist = Watchlist.query.get(id)
    watchlist_stocks = [stock.to_dict() for stock in watchlist.stocks]
    stock_ids = [stock['stock_id'] for stock in watchlist_stocks]
    stocks = Stock.query.filter(Stock.id.in_(stock_ids)).all()
    final_stocks = [stock.to_dict() for stock in stocks]
    return final_stocks

