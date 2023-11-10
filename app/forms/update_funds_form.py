from flask_wtf import FlaskForm
from wtforms import DecimalField
from wtforms.validators import DataRequired

class UpdateFundsForm(FlaskForm):
    funds = DecimalField('funds', validators=[DataRequired()])
