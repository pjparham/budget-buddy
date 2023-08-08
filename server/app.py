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
    
    def patch(self, user_id):
        if not session.get('user_id') or session.get('user_id') != user_id:
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        user = User.query.filter(User.id == session['user_id']).first()
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 404)
        
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')
        
        if not name or not password or not email:
            return make_response(jsonify({'error': 'Name, Email, and Password are required fields'}), 400)
        
        user.email = email
        user.name = name
        user.password_hash = user._generate_password_hash(password)
        
        db.session.commit()

        return make_response(jsonify(user.to_dict()), 200)
    
    def delete(self, user_id):
        if not session.get('user_id') or session.get('user_id') != user_id:
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        user = User.query.filter(User.id == session['user_id']).first()
        
        try:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'User deleted successfully'}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the user'}), 500)

api.add_resource(Users, '/users', '/users/<int:user_id>')

class Budgets(Resource):
    def get(self, budget_id):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), 404)
        
        # check if budget belongs to logged in user
        user = User.query.filter(User.id == session['user_id']).first()
        if budget.user != user:
            return make_response(jsonify({'error': 'Not authorized to retrieve this budget'}), 401)
        
        try:
            return make_response(jsonify(budget.to_dict()), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the budget'}), 500)


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
        float_amount = float(amount)

        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), 404)
        
        
        try:
            with db.session.begin_nested():  
                new_income = Income(title=title, amount=float_amount, budget=budget)
                db.session.add(new_income)
                db.session.flush()  # Flush the session to get the new_income.id
                budget.remaining_amount += float_amount

            db.session.commit()  

            return make_response(jsonify(new_income.to_dict()), 201)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this income'}), 500)
        
    def delete(self, income_id):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        income = Income.query.get(income_id)
        if not income:
            return make_response(jsonify({'error': 'Income not found'}), 404)
        
        try:
            with db.session.begin_nested():  
                budget = income.budget
                
                if budget.remaining_amount < income.amount:
                    return make_response(jsonify({'error': 'Deleting this income would result in negative remaining amount'}), 400)

                budget.remaining_amount -= income.amount
                db.session.delete(income)

            db.session.commit() 

            return make_response(jsonify({'message': 'Income deleted successfully'}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the income'}), 500)

api.add_resource(Incomes, '/incomes', '/incomes/<int:income_id>')

class Categories(Resource):
    def post(self):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        budget_id = data.get('budget_id')
        float_amount = float(amount)

        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), 404)
        
        if budget.remaining_amount < float_amount:
            return make_response(jsonify({'error': 'Adding this category would result in negative remaining amount'}), 400)
        
        
        try:
            with db.session.begin_nested():  
                new_category = Category(title=title, amount=float_amount, budget=budget)
                db.session.add(new_category)
                db.session.flush()
                budget.remaining_amount -= float_amount

            db.session.commit()  

            return make_response(jsonify(new_category.to_dict()), 201)

        except Exception as e:
            print(e)
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this category'}), 500)
        
api.add_resource(Categories, '/categories', '/categories/<int:category_id>')

class Expenses(Resource):
    def post(self):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        category_id = data.get('category_id')
        float_amount = float(amount)

        category = Category.query.get(category_id)
        if not category:
            return make_response(jsonify({'error': 'Category not found'}), 404)
        
        try:
            new_expense = Expense(title=title, amount=float_amount, category=category)
            db.session.add(new_expense)
            db.session.commit()

            return make_response(jsonify(new_expense.to_dict()), 201)

        except Exception as e:
            print(e)
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this expense'}), 500)
        
    def delete(self, expense_id):
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), 401)
        
        expense = Expense.query.get(expense_id)
        if not expense:
            return make_response(jsonify({'error': 'Expense not found'}), 404)
        
 
        try:
            db.session.delete(expense)
            db.session.commit() 

            return make_response(jsonify({'message': 'Expense deleted successfully'}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the expense'}), 500)

api.add_resource(Expenses, '/expenses', '/expenses/<int:expense_id>')


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