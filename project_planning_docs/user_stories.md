# User Stories

## Users

### Sign Up

* As an unregistered and unauthorized user, I want to be able to sign up for the website via a sign-up form.
  * When I'm on the `/signup` page:
    * I would like to be able to enter my email, username, and preferred password on a clearly laid out form.
    * I would like the website to log me in upon successful completion of the sign-up form.
      * So that I can seamlessly access the site's functionality
  * When I enter invalid data on the sign-up form:
    * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
    * So that I can try again without needing to refill forms I entered valid data into.

### Log in

* As a registered and unauthorized user, I want to be able to log in to the website via a log-in form.
  * When I'm on the `/login` page:
    * I would like to be able to enter my email and password on a clearly laid out form.
    * I would like the website to log me in upon successful completion of the lob-up form.
      * So that I can seamlessly access the site's functionality
  * When I enter invalid data on the log-up form:
    * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
      * So that I can try again without needing to refill forms I entered valid data into.

### Demo User

* As an unregistered and unauthorized user, I would like an easy to find and clear button on both the `/signup` and `/login` pages to allow me to visit the site as a guest without signing up or logging in.
  * When I'm on either the `/signup` or `/login` pages:
    * I can click on a Demo User button to log me in and allow me access as a normal user.
      * So that I can test the site's features and functionality without needing to stop and enter credentials.

### Log Out

* As a logged in user, I want to log out via an easy to find log out button on the navigation bar.
  * While on any page of the site:
    * I can log out of my account and be redirected to a page displaying the options to sign in or create an account.
      * So that I can easily log out to keep my information secure.


## Portfolio

### View Portfolio
* As a logged in user, I would like to see my portfolio.
    * When I'm on the `/` page as a user who owns stock or has funds greater than zero:
        * I can see a pie chart displaying the percentage of how much money I have invested into each stock.
          * In the center of the pie chart I should see the total worth of my portfolio as well as my total funds available to invest.
        * I can see a list of all my stocks I've currently invested in.
            * For each stock in the list I can see its name, weight, number of shares, and its current evaluation (price).
            * I should be able to click on any of the stocks and it take me to that stocks detail page
        <!-- * I can see a drop down for my watchlists on the right hand side. -->
    * When I'm on the `/` page as a user who owns no stock and has no funds:
        * I can see a message telling me to create a portfolio by adding money
        <!-- double check this with group -->
* As a user who has not logged in, I should be taken to the landing page which gives me the options to log in or sign up.

### Create Portfolio
* As a user with no funds I should be able to add funds which will create my portfolio.
    * Upon creation my portfolio should include:
      * A blank pie chart with my balance in the center
      * A link leading me to a page showing different stock options for me to invest in
      <!-- since its a new portfolio there is no stock data to grab yet -->

### Update Portfolio
* As a User with a portfolio I should see a option on the left hand side to add funds.
    * Clicking add funds should opens, a modal asking me to input a value lower than $10,000,000, where I can add money to my funds.
        * Adding funds should update my total investing allowance
            *  The new total allowance should be seen on the portfolio page ,`/`, in the middle of the pie chart under 'Funds'.

    <!-- this could also be a modal instead of having to create a whole page -->

### Delete Stock
* As a user with a portfolio and who owns stock, I should have the option to sell the stock.
    * I should be able to sell a specific stock in partial (a specified number of shares) or in full (all shares of that stock).
    * Once a stock is deleted ,or sold, my portfolio page should update to represent the changes.
        * My funds should go up based on how much stock was sold and its price at the time of selling.
        * If a stock is only partialy sold the number of stock shares should change to reflect the new amount of stock I own.
        * If my stock is completely sold off the stock should no longer appear in my portfolio.


## Stock Details

### View Details of Selescted Stock
* When accessing a stocks detail page ,`/:tickerSymbol`,as a logged in user I should see:
<!-- check this with group, could be ticker symbol or an id -->
  * A graph with the stocks price evaluation over time
  <!-- check that with group -->
  * The stocks current position, percent change, current valuation, and change in price in USD
  * A table containing the stocks price, change in price, percent change, opening price, closing price, high, low, and volume.
  * I should be able to see a description of the company and their logo? <-- MAYBE

### Purchasing Stock
* When accessing a stocks detail page ,`/:tickerSymbol`,as a logged in user I should be able to:
<!-- check this with group, could be ticker symbol or an id -->
  * Buy shares in the stock or sell them if I already own shares at the bottom of the page
    * The Transaction componet should open automaticallty with the stock ticker autofilling.
      * Depending on the ticker field inputed by me, the current share price should auto update.
    * If I do not have enough money to buy the amount of shares I would like, the submit button should be disabled.

  ### Update Amount of Stock Shares Purchased
  * When buying shares I should be able to update the total amount of shares I would like to be greater than 1.

  ### Delete Stocks from my Order
  * When purchasing shares I should be able to decrease the amount of shares I would like to order.
   * I should not be able to delete more shares than I have in my order.





## Watchlists

### Viewing Watchlists
* As a logged in user accessing the `/:userId/watchlist` page  I should be able to add watchlists
  * Each watchlist should be able to have their own name witch is defaulted to 'Watchlist 1' etc.
<!-- idk how to word that -->
* As a logged in user accessing the `/:userId/watchlist` page I am shown my watchlists.
  * Each watchlist shows a table containing each stocks on the watchlist name, ticker, price, price change, percent change, open price, close price, high price, low price, and volume.
    * I should be able to hover over a stock and it highlight that specific stock.
      * If clicked I should be redirected to that stocks detail page.

### Adding Stocks to Watchlist
* As a logged in user accessing a stocks detail page, `/:tickerSymbol`, I should be able to add a stock to my watchlist.
  * Adding a stock to my watchlist should make that stock appear in its selected watchlist which I can see at the `/watchlist` page.

### Deleting Stock from Watchlist
* As a logged in user accessing my `/:userId/watchlist` page, I should be able to delete a stock from my watchlist.
  * Each stock on my watchlist should have an button with an x that when clicked should seemlessly delete the stock from my watchlist and update my watchlist to reflect that

## Search

### Search Stock by Name
* From any page as a logged in user I should have the ability to search for a stock by name from a search bar located in the nav bar.
  * While I type in the stock I should be shown different options that match my current search criteria.
    * Ex: If I type in 'A' I should be able to see a list below the search bar including "Amazon.com Inc." and "Apple.inc"

### View Results of Search
* As a logged in user searching for a stock by name should bring me to that stocks specific page at `/:tickerSymbol`.
  * If the searched stock doesnt exist or isnt on the platform I will be shown an error message stating such.


## Bonus: Transactions

### Transaction History
* As a logged in user I should have access to a transaction page `/:userId/transactions`.
  * this page should show me my past transaction history and show me when specific chares of stocks were ordered.


### Order
* As a logged in user viewing my transaction history I should be able to reorder a specific stock via modal and set a time/frequency variable to automatically order more shares for me.

### Cancel Transactions
* As a logged in user with automatic transactions set up, I should be able to view them on my transactions page and cancel them at any time by clicking a cancel button.
  * Clicking this button should pop up a modal confirming that I would like to cancel the transaction.
