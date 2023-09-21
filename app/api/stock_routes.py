from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Portfolio, Stock

portfolio_routes = Blueprint('stocks', __name__)


