import os
import requests

KEY = os.environ.get("KEY")
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

stock_names = [
    'NIO Inc.', 'Tesla Inc.', 'Vale S.A.', 'Amazon.com Inc.', 'Intel Corp.', 'Apple Inc.', 'Avinger Inc.', 'Advanced Micro Devices Inc.', 'Ford Motor Co.',
    'Palantir Technologies Inc.', 'NVIDIA Corp.', 'Bank of America Corp.', 'Baytex Energy Corp.', 'Rivian Automotive Inc.', 'Pinterest Inc.', 'AT&T Inc.', 'Pfizer Inc.', 'Petróleo Brasileiro S.A. - Petrobras', 'Lucid Group Inc.',
    'Tilray Inc.', 'American Airlines Group Inc.', 'Marathon Digital Holdings Inc.', 'Carnival Corp.', 'AMC Entertainment Holdings Inc.', 'Verizon Communications Inc.', 'Grab Holdings Ltd', 'The Walt Disney Co.', 'Kenvue Inc', 'Alphabet Inc. (Class A)',
    'Snap Inc.', 'Southwestern Energy Co.', 'Uber Technologies Inc.', 'Riot Blockchain Inc.', 'SoFi Technologies Inc.', 'Rackspace Technology Inc.', 'Square Inc.', 'Rocket Lab USA Inc', 'Microsoft Corp.', 'Aurora Innovation Inc',
    'Transocean Ltd.', 'Eos Energy Enterprises Inc', 'Meta Platforms Inc.', 'Comcast Corp.', 'Nokia Corp.', 'Affirm Holdings Inc.', 'JetBlue Airways Corp.', 'Alphabet Inc. (Class C)', 'PG&E Corp.', 'Wells Fargo & Co.',
    'CSX Corp.', 'Barrick Gold Corp.', 'XPeng Inc.', 'Roblox Corp.', 'Itaú Unibanco Holding S.A.', 'Kinder Morgan Inc.', 'Uranium Energy Corp.', 'Cleveland-Cliffs Inc.', 'Shopify Inc.', 'Carvana Co.',
    'Revance Therapeutics Inc.', 'Farfetch Ltd.', 'Freeport-McMoRan Inc.', 'Macy’s Inc.', 'Virgin Galactic Holdings Inc.', 'Peloton Interactive Inc.', 'Equinox Gold Corp', 'Exxon Mobil Corp.', 'Ambev S.A.', 'Nu Holdings Ltd',
    'TechnipFMC PLC', 'United States Steel Corp.', 'Plug Power Inc.', 'The Coca-Cola Co.', 'Norwegian Cruise Line Holdings Ltd.', 'CRH PLC ADR', 'Opendoor Technologies Inc.', 'PayPal Holdings Inc.', 'Raytheon Technologies Corp.', 'Unity Software Inc', 'CleanSpark Inc', 
    'Coupang Inc.', 'Citigroup Inc.', 'Medical Properties Trust Inc.', 'U.S. Bancorp', 'Cisco Systems Inc.', 'ChargePoint Holdings Inc.', 'Warner Bros Discovery Inc', 'Truist Financial Corp.', 'Walgreens Boots Alliance Inc.', 'Novavax Inc.', 'Newmont Corp.',
    'Huntington Bancshares Inc.', 'Bristol-Myers Squibb Co.', 'Micron Technology Inc.', 'Marathon Oil Corp.', 'Sirius XM Holdings Inc.', 'Viatris Inc.', 'KeyCorp', 'Bausch Health Companies Inc.', 'Barclays PLC'
]

robust_seed_data = []
final_seed_data = []

for i in seed_data:
    url = f"https://data.alpaca.markets/v2/stocks/snapshots?symbols={i}&feed=iex"
    headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": KEY,
    "APCA-API-SECRET-KEY": SECRET
    }
    r = requests.get(url, headers=headers)
    data = r.json()
    robust_seed_data.append(data)

for i, ticker in enumerate(seed_data):
    x = {}
    data = robust_seed_data[i]

    x['name'] = stock_names[i]
    x['ticker'] = ticker
    x['price'] = data.get(ticker, {}).get('latestTrade', {}).get('p', None)
    x['open'] = data.get(ticker, {}).get('dailyBar', {}).get('o', None)
    x['close'] = data.get(ticker, {}).get('prevDailyBar', {}).get('c', None)
    x['high'] = data.get(ticker, {}).get('dailyBar', {}).get('h', None)
    x['low'] = data.get(ticker, {}).get('dailyBar', {}).get('l', None)
    x['volume'] = data.get(ticker, {}).get('dailyBar', {}).get('v', None)

    final_seed_data.append(x)

