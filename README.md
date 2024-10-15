# Transation Management System

git clone https://github.com/anil-raparthi/tms.git


cd tms

## Server

cd server

Update the .env file with the configuration values

Run the following command to start server:

```
python app.py
```

For database configuration mongodb atlas uri in the env

## MongoDB configuration

```
database: tms
username, password
collections: users, transactions
type, amount, date
```

## Client

cd client

```
npm start
```