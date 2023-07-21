# budget-buddy

## Budget Buddy Usage
Once you clone the repo to your local device, run 'pipenv install; pipenv shell' to enter your virtual environment.
Excecute the following commands in the 'server/' directory as well to configure your Flask environment:
export FLASK_APP=app.py
export FLASK_RUN_PORT=5555

Execute 'flask run' to spin up server.

In the 'client/' director, execute 'npm install' in your terminal to install dependencies. Run 'npm start' to run application on port 4000.


## Contributions 
### Back End development setup
Once your clone the repo to your local device, run 'pipenv install; pipenv shell' to enter your virtual environment. 
Excecute the following commands in the 'server/' directory as well to configure your Flask environment:
export FLASK_APP=app.py
export FLASK_RUN_PORT=5555
If you need to make changes to database schema, create a .env file in server directory and add the secret key. Please contact repo owner for secret key.