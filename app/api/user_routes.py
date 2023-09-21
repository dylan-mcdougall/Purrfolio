from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Portfolio

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/portfolio')
@login_required
def portfolio(id):
    """
    Query to return the portfolio associated with the user.id
    """
    user = User.query.get(id)
    return user.portfolio.to_dict()
>>>>>>> ed0d0e3947c91d535629469582a61c0721084b95
