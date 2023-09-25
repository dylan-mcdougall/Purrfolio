from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload
from app.forms import UpdateUserForm
from app.models import User, Portfolio, db, Watchlist
from .auth_routes import authenticate, validation_errors_to_error_messages
from .fetch_logic import fetch_portfolio_details, fetch_watchlist_stocks

user_routes = Blueprint('users', __name__)

# User

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>', methods=["PATCH"])
@login_required
def update_user(id):
    form = UpdateUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    res = authenticate()
    if res.get('errors'):
        return res, 401
    if res['id'] == id:
        if form.validate_on_submit():
            user = User.query.get(id)
            user.first_name = form.data['first_name']
            user.last_name = form.data['last_name']
            user.username = form.data['username']
            user.email = form.data['email']
            db.session.commit()
            return user.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    return {'errors': ['Unauthorized']}, 403

# User portfolio

@user_routes.route('/current/portfolio')
@login_required
def portfolio():
    """
    Query to return the portfolio associated with the logged in user,
    includes expanded details
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    portfolio = Portfolio.query.filter(Portfolio.user_id == res['id']).first()
    if portfolio == None:
        return {"errors": ["Portfolio associated with this user does not exist, please make a new account"]}, 404
    portfolio_dict = fetch_portfolio_details(portfolio.id)
    return {"portfolio": portfolio_dict}

# User watchlists

@user_routes.route('/current/watchlists')
@login_required
def watchlists():
    """
    Query to return the watchlists created by the logged in user
    """
    res = authenticate()
    if res.get('errors'):
        return res, 401
    watchlists = Watchlist.query.filter(Watchlist.user_id == res['id']).all()
    if watchlists == None:
        return {"errors": ["User does not have any watchlists"]}, 404
    watchlist_list = [watchlist.to_dict() for watchlist in watchlists]
    for watchlist in watchlist_list:
        watchlist['stocks'] = fetch_watchlist_stocks(watchlist['id'])
    return { 'watchlists': watchlist_list}
