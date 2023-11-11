from flask_wtf import FlaskForm
from wtforms import IntegerField, BooleanField, StringField, SelectField
from wtforms.validators import DataRequired

class TransactionForm(FlaskForm):
    ticker = StringField('ticker', validators=[DataRequired()])
    type = SelectField('type', choices=[('Share', 'share'), ('Dollar', 'dollar')], validators=[DataRequired()])
    quantity = IntegerField('quantity', validators=[DataRequired()])
    buy = BooleanField('buy')
    order_type = SelectField('order', choices=[('Market', 'market')], validators=[DataRequired()])
