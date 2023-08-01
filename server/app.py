from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()

from models import db, User, Budget, Income, Category, Expense

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget-buddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
CORS(app)
migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)

api = Api(app)
app.secret_key = os.environ.get('SECRET_KEY')

class Users(Resource):
    def get(self):
        name = request.json['name']
        user = User.query.filter_by(name=name).first()
        if not user:
            return make_response(jsonify({'error': 'user not found'}), 404)
        user_dict = user.to_dict()
        return make_response(jsonify(user_dict), 200)
    
    def post(self):
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')

        if not name or not password or not email:
            return make_response(jsonify({'error': 'Name, Email, and Password are required fields'}), 400)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return make_response(jsonify({'error': 'User Already Exists'}), 409)

        new_user = User(name=name, email=email)
        new_user.password_hash = new_user._generate_password_hash(password)
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify(new_user.to_dict()), 201)


api.add_resource(Users, '/users')

class Budgets(Resource):
    def post(self):
        data = request.get_json()
        title = data.get('title')
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            new_budget = Budget(title=title, user=user)
            db.session.add(new_budget)
            db.session.commit()
            return make_response(jsonify(new_budget.to_dict()), 201)
        else:
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
    def delete(self, budget_id):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), 404)
        
        # check if budget belongs to logged in user
        user = User.query.filter(User.id == session['user_id']).first()
        if budget.user != user:
            return make_response(jsonify({'error': 'Not authorized to delete this budget'}), 401)
        
        try:
            db.session.delete(budget)
            db.session.commit()
            return make_response(jsonify({'message': 'Budget deleted successfully'}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the budget'}), 500)
        
api.add_resource(Budgets, '/budgets', '/budgets/<int:budget_id>')

class Incomes(Resource):
    def post(self):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        budget_id = data.get('budget_id')

        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), 404)
        
        
        try:
            with db.session.begin_nested():  # starts a nested transaction
                new_income = Income(title=title, amount=amount, budget=budget)
                db.session.add(new_income)
                db.session.flush()  # Flush the session to get the new_income.id
                budget.remaining_amount += amount

            db.session.commit()  # Commit the nested transaction

            return make_response(jsonify(new_income.to_dict()), 201)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this income'}), 500)

api.add_resource(Incomes, '/incomes')


class Login(Resource):
    def post(self):
        request_json = request.get_json()
        email = request_json.get('email')
        password = request_json.get('password')

        user = User.query.filter(User.email == email).first()

        if user:
            if user.check_password(password):
                session['user_id'] = user.id
                return make_response(jsonify(user.to_dict()), 200)
            
        return {'error': 'Invalid Username or Password'}, 401

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)

api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            return make_response(jsonify(user.to_dict()), 200)
        return {'error': '401 Unauthroized'}, 401
    
api.add_resource(CheckSession, '/check_session')

class Testing(Resource):
    def get(self):
        user = User.query.first()
        print(session['user_id'])
        return make_response(jsonify(user.to_dict()), 200)
    
    
api.add_resource(Testing, '/testing')


if __name__ == '__main__':
    app.run(port=5555, debug=True)