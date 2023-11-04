import os
import requests

def stocks_fetch():
    KEY = os.environ.get("KEY")
    SECRET = os.environ.get("SECRET")

    seed_data = "NIO%2CTSLA%2CVALE%2CAMZN%2CINTC%2CAAPL%2CAVGR%2CAMD%2CF%2CPLTR%2CNVDA%2CBAC%2CBTE%2CRIVN%2CPINS%2CT%2CPFE%2CPBR%2CLCID%2CTLRY%2CAAL%2CMARA%2CCCL%2CAMC%2CVZ%2CGRAB%2CDIS%2CKVUE%2CGOOGL%2CSNAP%2CSWN%2CUBER%2CRIOT%2CSOFI%2CRXT%2CSQ%2CRKLB%2CMSFT%2CAUR%2CRIG%2CEOSE%2CMETA%2CCMCSA%2CNOK%2CAFRM%2CJBLU%2CGOOG%2CPCG%2CWFC%2CCSX%2CGOLD%2CXPEV%2CRBLX%2CITUB%2CKMI%2CUEC%2CCLF%2CSHOP%2CCVNA%2CRVNC%2CFTCH%2CFCX%2CM%2CSPCE%2CPTON%2CEQX%2CXOM%2CABEV%2CNU%2CFTI%2CX%2CPLUG%2CKO%2CNCLH%2CCRH%2COPEN%2CPYPL%2CRTX%2CU%2CCLSK%2CCPNG%2CC%2CMPW%2CUSB%2CCSCO%2CCHPT%2CWBD%2CTFC%2CWBA%2CNVAX%2CNEM%2CHBAN%2CBMY%2CMU%2CMRO%2CSIRI%2CVTRS%2CKEY%2CBHC%2CBCS"

    seed_data_list = [
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

    combined_list = [[seed_data_list[i], stock_names[i]] for i in range(len(seed_data_list))]
    combined_list = sorted(combined_list, key=lambda stock: stock[0])

    # Iterate through combined_list
    # When an item matches, modify the output as desired and push into final response

    final_seed_data = []

    url = f"https://data.alpaca.markets/v2/stocks/snapshots?symbols={seed_data}&feed=iex"
    headers = {
        "accept": "application/json",
        "APCA-API-KEY-ID": KEY,
        "APCA-API-SECRET-KEY": SECRET
    }
    r = requests.get(url, headers=headers)
    data = r.json()


    for i, (ticker, name) in enumerate(combined_list):
        x = {}

        x['name'] = name
        x['ticker'] = ticker
        x['price'] = data.get(ticker, {}).get('latestTrade', {}).get('p', None)
        x['open'] = data.get(ticker, {}).get('dailyBar', {}).get('o', None)
        x['close'] = data.get(ticker, {}).get('prevDailyBar', {}).get('c', None)
        x['high'] = data.get(ticker, {}).get('dailyBar', {}).get('h', None)
        x['low'] = data.get(ticker, {}).get('dailyBar', {}).get('l', None)
        x['volume'] = data.get(ticker, {}).get('dailyBar', {}).get('v', None)

        final_seed_data.append(x)
    return final_seed_data
