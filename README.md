# HealthHelper-React

HealthHelper-React is a complete revision of a project I completed a few 
years ago. In particular, the old project was created with Python and PyQt 
as a desktop application, while this rendition is a web application built 
with the PERN stack. HealthHelper is a simple web application that allows 
users to keep track of the foods they eat along with associated calories, 
macro nutrients, and expenses. 

# Try It Out

Head on over to https://health-helper-react.herokuapp.com to see this project in action.

Warning: You might need to disable certain ad-blockers to view or modify log entries.

# Built With

* React
* Node / Express
* PostgreSQL
* Firebase (authentication)
* Bootstrap

# Development Setup

First, clone the repo and change into the resulting directory.
```
git clone https://github.com/Floyd-Droid/HealthHelper-React.git
cd HealthHelper-React
```

Install dependencies
```
npm run setup
```

Install PostgreSQL, and create a role and database for your development environment.
Run the following files against your new database:
- /api/SQL/tables.sql
- /api/SQL/functions.sql

Create a .env file with the following variables (substitute the values with your own):
```
DATABASE_HOST="localhost"
DATABASE_USER="db_user"
DATABASE="db_name"
DATABASE_PASSWORD="db_pw"
DATABASE_PORT=5432
```

Run the React app and the development server.
```
npm run dev
npm run client
```


# Author

Jourdon Floyd

email: jourdonfloyd@gmail.com

GitHub: https://github.com/Floyd-Droid

# License

This project is licensed under the MIT License - see the LICENSE.md file for details.
