from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class UpdateFundsForm(FlaskForm):
    funds = IntegerField('funds', validators=[DataRequired()])
