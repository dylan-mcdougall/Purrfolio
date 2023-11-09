# Purrfolio :money_with_wings:
##### Afford the life your cat deserves. :smiley_cat:

__Purrfolio__ is a stock trading website. __Purrfolio__ allows users to buy and sell stocks and to watch stocks. __Purrfolio__ was created by [Dylan](https://github.com/dylan-mcdougall), [Charles](https://github.com/C-Carroll), and [Emily](https://github.com/eanorman) Check it out [here](http://https://purrfolio.onrender.com/).

## Technologies Used
![HTML](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

## Index
- :moneybag: [Features](#features)
- :smile_cat: [User Stories](#user-stories)
- :money_with_wings: [Schema](#schema)
- :heart_eyes_cat: [Installing Locally](#installing-locally)

## Features
- :money_with_wings: Create your portfolio
- :money_with_wings: Buy and sell stocks
- :money_with_wings: Search for stocks and view trend data
- :money_with_wings: Create a watchlist to keep an eye on your favorite stocks!

## User Stories
### Users :busts_in_silhouette:
_Sign Up_
- As a new user, I should be able to sign up for an account with valid information.

_Log In_
- As an existing user, I should be able to login with my account information.

### Portfolio :dollar:
_View Portfolio_
- As a user after logging in, I should be able to view my portfolio.

_Create Portfolio_
- As a user with no funds I should be able to add funds which will create my portfolio.

_Update Portfolio_
- As a user, I should be able to add funds to my portfolio.

_Delete Stock_
- As a user with a portfolio that has stocks in it, I should have the option to sell my stocks.

### Stock Details :moneybag:
_View Stock Details_
- As a user, I should be able to access a stock's detail page that shows a graph with the stock's price evaluation over time, the stocks current position and changes.

_Purchase Stock_
- As a user, I should be able to purchase stocks from the stock's detail page and see if I already own stocks of this company.

_Update Amount of Shares Purchased_
- As a user, when purchasing stocks I should be able to update the total amount of shares I would like to purchase.

### Watchlists :star:
_View Watchlists_
- As a user, I should be able to view my watchlists.

_Add to Watchlist_
- As a user, I should be able to add stocks to my watchlist.

_Delete From Watchlist_
- As a user, I should be able to delete stocks from my watchlist.

### Search :mag:
_Search Stock By Name_
- As a user, I should be able to search for stocks by company name.

_View Search Results_
- As a user, I should be able to view the results of the search and click on the name of the company to see the stock details page.

### Transactions :money_with_wings:
_View Transaction History_
- As a user, I should be able to see my transaction history of all stocks bought and sold.

## Schema
![Database Schema](https://user-images.githubusercontent.com/107007986/269121197-c363564d-7532-4d39-9818-c7fd489a6552.png)

## Installing Locally
1. Clone this repository:
`https://github.com/dylan-mcdougall/python-group-project.git`
2. Install Python dependencies with the command: `pipenv install -r requirements.txt`
3. Create a .env file in the root directory using the .env.example provided
4. Create the database using the commands: `pipenv run flask db upgrade` `pipenv run flask seed all`
5. Change directory to react-app and run `npm install` and `npm start`
6. Enjoy! :star:
