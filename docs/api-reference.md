# API Documentation

  ## Session Routes

  ### Login
  * Request
    * Method: POST
    * URL: /api/auth/login
    * Body:
    
    ```json
    {
      "email": "demo@aa.io",
      "password": "password"
    }
    ```
    
  * Successful Response
    * Body:

    ```json
    {
      "id": "1",
      "first_name": "Demo",
      "last_name": "Boii",
      "username": "demo",
      "email": "demo@aa.io"
    }
    ```

  ### Sign Up
  * Request
    * Method: POST
    * URL: /api/auth/signup
    * Body:

  ```json
  {
    "first_name": "Demo",
    "last_name": "Boii",
    "email": "demo@aa.io",
    "username": "demo",
    "password": "password"
  }
  ```

  * Successful Response
    * Body:
  
  ```json
  {
    "id": "1",
    "first_name": "Demo",
    "last_name": "Boii",
    "username": "demo",
    "email": "demo@aa.io"
  }
  ```

  ### Logout
  * Request
    * Method: GET
    * URL: /api/auth/logout
    * Body:
          None

  * Successful Response
    * Body:

  ```json
  {
    "message": "User logged out"
  }
  ```

  ## User Routes

  ### Get User by id
  * Request
    * Method: GET
    * URL /api/users/:id
    * Body:
        None

  * Successful Response
    * Body:

  ```json
  {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "Boii",
    "username": "Demo"
  }
  ```

  ### Update User information
  * Request
    * Method: PATCH
    * URL: /api/users/:id
    * Body: Form-Data

  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "username": "unique username",
    "email": "valid email"
  }
  ```

  * Successful Response
    * Body:

  ```json
  {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "username": "demo",
    "id": 1,
    "last_name": "Boii",
  }
  ```

  ### Get the logged in User's Portfolio
  * Request
    * Method: GET
    * URL: /api/users/current/portfolio
    * Body:
        None

  * Successful Response
    * Body:

  ```json
  {
    "portfolio": {
        "created_at": "Fri, 22 Sep 2023 19:08:07 GMT",
        "current_funds": 100000.69,
        "fund_history": 230000.0,
        "id": 2,
        "last_modified": "Fri, 22 Sep 2023 19:08:07 GMT",
        "stock_valuation": 408.32000000000005,
        "stocks": [
            {
                "id": 1,
                "portfolio_id": 2,
                "quantity": 20,
                "stock_id": 100
            },
            {
                "id": 2,
                "portfolio_id": 2,
                "quantity": 31,
                "stock_id": 99
            }
        ],
        "total_valuation": 100409.01000000001,
        "transactions": [
            {
                "created_at": "Fri, 22 Sep 2023 19:08:37 GMT",
                "id": 1,
                "last_modified": "Fri, 22 Sep 2023 19:08:37 GMT",
                "portfolio_id": 2,
                "price": 7.77,
                "quantity": 20,
                "stock_id": 100
            },
            {
                "created_at": "Fri, 22 Sep 2023 19:08:37 GMT",
                "id": 2,
                "last_modified": "Fri, 22 Sep 2023 19:08:37 GMT",
                "portfolio_id": 2,
                "price": 8.175,
                "quantity": 31,
                "stock_id": 99
            }
        ],
        "user": {
            "email": "marnie@aa.io",
            "first_name": "Marnie",
            "id": 2,
            "last_name": "Brother",
            "username": "marnie"
        },
        "user_id": 2
    }
  }
  ```

  ### Get the logged in User's Watchlists
  * Request
    * Method: GET
    * URL: /api/users/current/watchlists
    * Body:
        None

  * Successful Response
    * Body:

  ```json
  {
    "watchlists": [
        {
            "created_at": "Fri, 22 Sep 2023 19:08:37 GMT",
            "id": 3,
            "last_modified": "Fri, 22 Sep 2023 19:08:37 GMT",
            "name": "Pretty Lists",
            "stocks": [
                {
                    "close": 8.455,
                    "high": 8.79,
                    "id": 1,
                    "low": 8.45,
                    "name": "NIO Inc.",
                    "open": 8.76,
                    "price": 8.49,
                    "ticker": "NIO",
                    "volume": 429525
                },
                {
                    "close": 255.68,
                    "high": 257.68,
                    "id": 2,
                    "low": 245.48,
                    "name": "Tesla Inc.",
                    "open": 257.43,
                    "price": 246.57,
                    "ticker": "TSLA",
                    "volume": 575385
                }
            ],
            "user_id": 2
        }
    ]
  } 
  ```

  ## Portfolio Routes

  ###  Update a Portfolio's funds
  * Request
    * Method: PATCH
    * URL: /api/portfolios/:id/add-funds
    * Body: Form-Data

  ```json
  {
    "funds": "any number between 0 and 10,000,000"
  }
  ```

  * Successful Response
    * Body:

  ```json
  {
    "created_at": "Fri, 22 Sep 2023 19:08:07 GMT",
    "current_funds": 100075.69,
    "fund_history": 230075.0,
    "id": 2,
    "last_modified": "Fri, 22 Sep 2023 20:47:46 GMT",
    "user_id": 2
  }
  ```

  ## Stock Routes

  ### Get the details of a Stock by id
  * Request
    * Method: GET
    * URL: /api/stocks/:id
    * Body:
        None

  * Successful Response
    * Body:

  ```json
  {
    "close": 8.455,
    "high": 8.79,
    "id": 1,
    "low": 8.45,
    "name": "NIO Inc.",
    "open": 8.76,
    "price": 8.49,
    "ticker": "NIO",
    "volume": 429525
  }
  ```

  ### Get the details of a Stock by ticker
  * Request
    * Method: GET
    * URL: /api/stocks/:ticker
    * Body:
        None

  * Successful Response
    * Body:

  ```json
  {
    "close": 8.455,
    "high": 8.79,
    "id": 1,
    "low": 8.45,
    "name": "NIO Inc.",
    "open": 8.76,
    "price": 8.49,
    "ticker": "NIO",
    "volume": 429525
  }
  ```


  ## Watchlist Routes

  ### Create a new Watchlist
  * Request
    * Method: POST
    * URL: /api/watchlists/new
    * Body:
        None
  
  * Successful Response
    * Body:

  ```json
  {
    "created_at": "Mon, 25 Sep 2023 23:25:42 GMT",
    "id": 4,
    "last_modified": "Mon, 25 Sep 2023 23:25:42 GMT",
    "name": "Watchlist",
    "user_id": 2
  }

  ### Get the details of a Watchlist by id
  * Request
    * Method: GET
    * URL: /api/watchlists/:id
    * Body:
      None
    
  * Successful Response
    * Body:

  ```json
  {
    "created_at": "Sat, 23 Sep 2023 20:17:39 GMT",
    "id": 3,
    "last_modified": "Mon, 25 Sep 2023 23:30:05 GMT",
    "name": "Henry",
    "stocks": [
        {
            "close": 8.395,
            "high": 8.405,
            "id": 99,
            "low": 8.13,
            "name": "Bausch Health Companies Inc.",
            "open": 8.405,
            "price": 8.215,
            "ticker": "BHC",
            "volume": 68902
        }
    ],
    "user_id": 2
  }
  ```

  ### Change the name of an existing Watchlist
  * Request
    * Method: PATCH
    * URL: /api/watchlists/:id
    * Body:
    
  ```json
  {
    "name": "Some name here"
  }
  ```

  * Successful Response
    * Body:

  ```json
  {
    "message": "Watchlist name updated successfully"
  }
  ```

  ### Delete a Watchlist by id
  * Request
    * Method: DELETE
    * URL: /api/watchlists/:id
    * Body: 
      None
  
  * Successful Response
    * Body:

  ```json
  {
    "message": "Watchlist successfully deleted"
  }
  ```

  ### Add a Stock to a Watchlist by id
  * Request
    * Method: POST
    * URL: /api/watchlists/:id/add-by-id
    * Body:
  
  ```json
  {
    "stock_id": "id"
  }
  ```

  * Successful Response
    * Body:
  
  ```json
  {
    "id": 1,
    "stock_id": 12,
    "watchlist_id": 5
  }
  ```

  ### Add a Stock to a Watchlist by ticker
  * Request
    * Method: POST
    * URL: /api/watchlists/:id/add-by-ticker
    * Body:

  ```json
  {
    "stock_ticker": "ABC"
  }
  ```

  * Successful Response:
    * Body:
  
  ```json
  {
    "id": 1,
    "stock_id": 12,
    "watchlist_id": 5
  }
  ```

  ### Remove a Stock from a Watchlist
  * Request
    * Method: DELETE
    * URL: /api/watchlists/:id/remove-stock
    * Body:
  
  ```json
  {
    "stock_id": "id"
  }
  ```

  * Successful Response
    * Body:
  
  ```json
  {
    "message": "Stock successfully removed from Watchlist"
  }
  ```
