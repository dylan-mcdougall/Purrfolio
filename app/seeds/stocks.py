from ..models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
import os
import requests

SECRET = os.environ.get("SECRET")

seed_data = [
    'NIO', 'TSLA', 'VALE', 'AMZN', 'INTC', 'AAPL', 'AVGR', 'AMD', 'F',
    'PLTR', 'NVDA', 'BAC', 'BTE', 'RIVN', 'PINS', 'T', 'PFE', 'PBR', 'LCID',
    'TLRY', 'AAL', 'MARA', 'CCL', 'AMC', 'VZ', 'GRAB', 'DIS', 'KVUE', 'GOOGL',
    'SNAP', 'SWN', 'UBER', 'RIOT', 'SOFI', 'RXT', 'SQ', 'RKLB', 'MSFT', 'AUR',
    'RIG', 'EOSE', 'META', 'CMCSA', 'NOK', 'AFRM', 'JBLU', 'GOOG', 'PCG', 'WFC',
    'CSX', 'GOLD', 'XPEV', 'RBLX', 'ITUB', 'KMI', 'UEC', 'CLF', 'SHOP', 'CVNA',
    'RVNC', 'FTCH', 'FCX', 'M', 'SPCE', 'PTON', 'EQX', 'XOM', 'ABEV', 'NU',
    'FTI', 'X', 'PLUG', 'KO', 'NCLH', 'CRH', 'OPEN', 'PYPL', 'RTX', 'U', 'CLSK',
    'CPNG', 'C', 'MPW', 'USB', 'CSCO', 'CHPT', 'WBD', 'TFC', 'WBA', 'NVAX', 'NEM',
    'HBAN', 'BMY', 'MU', 'MRO', 'SIRI', 'VTRS', 'KEY', 'BHC', 'BCS'
]

robust_seed_data = []


for i in seed_data:
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={i}&apikey={SECRET}'
    r = requests.get(url)
    data = r.json()
    robust_seed_data.append(data)

print robust_seed_data
