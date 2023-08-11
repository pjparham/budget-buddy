from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from functools import wraps

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

# HTTP Constants
HTTP_SUCCESS = 200
HTTP_CREATED = 201
HTTP_NO_CONTENT = 204
HTTP_UNAUTHORIZED = 401
HTTP_NOT_FOUND = 404
HTTP_BAD_REQUEST = 400
HTTP_CONFLICT = 409
HTTP_SERVER_ERROR = 500

def authorized(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        #checks session to ensure user is logged in 
        if not session.get('user_id'):
            return make_response(jsonify({'error': 'Not authorized'}), HTTP_UNAUTHORIZED)
        return func(*args, **kwargs)
    return wrapper

class Users(Resource):
    def get(self):
        name = request.json['name']
        user = User.query.filter_by(name=name).first()
        if not user:
            return make_response(jsonify({'error': 'user not found'}), HTTP_NOT_FOUND)
        user_dict = user.to_dict()
        return make_response(jsonify(user_dict), HTTP_SUCCESS)
    
    def post(self):
        #creates new user
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')

        if not name or not password or not email:
            return make_response(jsonify({'error': 'Name, Email, and Password are required fields'}), HTTP_BAD_REQUEST)

        #checks if other users have already used this email
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return make_response(jsonify({'error': 'User with this email already exists'}), HTTP_CONFLICT)

        new_user = User(name=name, email=email)
        new_user.password_hash = new_user._generate_password_hash(password)
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify(new_user.to_dict()), HTTP_CREATED)
    
    def patch(self, user_id):
        #updates user info
        if not session.get('user_id') or session.get('user_id') != user_id:
            return make_response(jsonify({'error': 'Not authorized'}), HTTP_UNAUTHORIZED)
        
        user = User.query.filter(User.id == session['user_id']).first()
        if not user:
            return make_response(jsonify({'error': 'User not found'}), HTTP_NOT_FOUND)
        
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')
        
        if not name or not password or not email:
            return make_response(jsonify({'error': 'Name, Email, and Password are required fields'}), HTTP_BAD_REQUEST)
        #checks if other users have already used this email
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return make_response(jsonify({'error': 'User with this email already exists'}), HTTP_CONFLICT)
        
        user.email = email
        user.name = name
        user.password_hash = user._generate_password_hash(password)
        
        db.session.commit()

        return make_response(jsonify(user.to_dict()), HTTP_SUCCESS)
    
    def delete(self, user_id):
        #deletes user
        if not session.get('user_id') or session.get('user_id') != user_id:
            return make_response(jsonify({'error': 'Not authorized'}), HTTP_UNAUTHORIZED)
        
        user = User.query.filter(User.id == session['user_id']).first()
        
        try:
            #deletes associated budgets, incomes, etc
            for budget in user.budgets:
                for income in budget.incomes:
                    db.session.delete(income)
                for category in budget.categories:
                    for expense in category.expenses:
                        db.session.delete(expense)
                    db.session.delete(category)
                db.session.delete(budget)
            

            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'User deleted successfully'}), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the user'}), HTTP_SERVER_ERROR)

api.add_resource(Users, '/users', '/users/<int:user_id>')

class Budgets(Resource):
    @authorized
    def get(self, budget_id):       
        #gets budget with provided ID 
        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), HTTP_NOT_FOUND)
        
        # check if budget belongs to logged in user
        user = User.query.filter(User.id == session['user_id']).first()
        if budget.user != user:
            return make_response(jsonify({'error': 'Not authorized to retrieve this budget'}), HTTP_UNAUTHORIZED)
        
        try:
            return make_response(jsonify(budget.to_dict()), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while retrieving this budget'}), HTTP_SERVER_ERROR)

    @authorized
    def post(self):
        #creates new budget
        data = request.get_json()
        title = data.get('title')

        user = User.query.filter(User.id == session['user_id']).first()

        try:
            new_budget = Budget(title=title, user=user)
            db.session.add(new_budget)
            db.session.commit()
            return make_response(jsonify(new_budget.to_dict()), HTTP_CREATED)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while creating the budget'}), HTTP_SERVER_ERROR)
    
    @authorized
    def patch(self, budget_id):
        #changes name of existing budget
        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), HTTP_NOT_FOUND)
    
        data = request.get_json()
        title = data.get('title')

        try:
            budget.title = title
            db.session.commit()
            return make_response(jsonify(budget.to_dict()), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while creating the budget'}), HTTP_SERVER_ERROR)

    @authorized
    def delete(self, budget_id):
        #deletes budget
        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), HTTP_NOT_FOUND)
        
        # check if budget belongs to logged in user
        user = User.query.filter(User.id == session['user_id']).first()
        if budget.user != user:
            return make_response(jsonify({'error': 'Not authorized to delete this budget'}), HTTP_UNAUTHORIZED)
        
        try:
            #deletes incomes belonging to this budget
            for income in budget.incomes:
                db.session.delete(income)

            #deletes categories belonging to this budget
            for category in budget.categories:
                for expense in category.expenses:
                    db.session.delete(expense)
                db.session.delete(category)

            db.session.delete(budget)
            db.session.commit()
            return make_response(jsonify({'message': 'Budget deleted successfully'}), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the budget'}), HTTP_SERVER_ERROR)
        
api.add_resource(Budgets, '/budgets', '/budgets/<int:budget_id>')


class Incomes(Resource):
    @authorized
    def post(self):
        #adds new income
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        budget_id = data.get('budget_id')
        float_amount = float(amount)

        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), HTTP_NOT_FOUND)
        
        try:
            with db.session.begin_nested():  
                new_income = Income(title=title, amount=float_amount, budget=budget)
                db.session.add(new_income)
                db.session.flush()  # Flush the session to get the new_income.id
                budget.remaining_amount += float_amount

            db.session.commit()  

            return make_response(jsonify(new_income.to_dict()), HTTP_CREATED)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this income'}), HTTP_SERVER_ERROR)
    
    @authorized
    def delete(self, income_id):
        #deletes income with proivded ID
        income = Income.query.get(income_id)
        if not income:
            return make_response(jsonify({'error': 'Income not found'}), HTTP_NOT_FOUND)
        
        try:
            with db.session.begin_nested():  
                budget = income.budget
                #ensures budget.reaining_amount does not go below 0
                if budget.remaining_amount < income.amount:
                    return make_response(jsonify({'error': 'Deleting this income would result in negative remaining amount'}), HTTP_BAD_REQUEST)

                budget.remaining_amount -= income.amount
                db.session.delete(income)

            db.session.commit() 

            return make_response(jsonify({'message': 'Income deleted successfully'}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the income'}), HTTP_SERVER_ERROR)

api.add_resource(Incomes, '/incomes', '/incomes/<int:income_id>')

class Categories(Resource):
    @authorized
    def get(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return make_response(jsonify({'error': 'Category not found'}), HTTP_NOT_FOUND)
    
        try:
            return make_response(jsonify(category.to_dict()), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while retrieving this category'}), HTTP_SERVER_ERROR)

    @authorized
    def post(self): 
        #creates new category       
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        budget_id = data.get('budget_id')
        float_amount = float(amount)

        budget = Budget.query.get(budget_id)
        if not budget:
            return make_response(jsonify({'error': 'Budget not found'}), HTTP_NOT_FOUND)
        #ensures budget.remaining_amount does not go below 0
        if budget.remaining_amount < float_amount:
            return make_response(jsonify({'error': 'Adding this category would result in negative remaining amount'}), HTTP_BAD_REQUEST)
        
        
        try:
            with db.session.begin_nested():  
                new_category = Category(title=title, amount=float_amount, budget=budget)
                db.session.add(new_category)
                db.session.flush()
                budget.remaining_amount -= float_amount

            db.session.commit()  

            return make_response(jsonify(new_category.to_dict()), HTTP_CREATED)

        except Exception as e:
            print(e)
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this category'}), HTTP_SERVER_ERROR)
    
    @authorized
    def patch(self, category_id):   
        # updates category data     
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        float_amount = float(amount)
        
        category = Category.query.get(category_id)
        if not category:
            return make_response(jsonify({'error': 'Category not found'}), HTTP_NOT_FOUND)
        
        budget = category.budget

        diff = float_amount - category.amount

        potential_remaining = budget.remaining_amount - diff
        #ensures budget.remaining_amount does not go below 0
        if potential_remaining < 0:
            return make_response(jsonify({'error': 'Updating this category would result in negative remaining amount'}), HTTP_BAD_REQUEST)
        
        try:
            category.amount = float_amount
            category.title = title
            budget.remaining_amount -= diff
            db.session.commit()

            return make_response(jsonify(category.to_dict()), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while updating the category'}), HTTP_SERVER_ERROR)

    @authorized
    def delete(self, category_id):
        #deletes category with provided ID
        category = Category.query.get(category_id)
        if not category:
            return make_response(jsonify({'error': 'Category not found'}), HTTP_NOT_FOUND)
        
        budget = category.budget

        try:
            budget.remaining_amount += category.amount
            #deletes associated expenses
            for expense in category.expenses:
                db.session.delete(expense)
            
            db.session.delete(category)
            db.session.commit()
            return make_response(jsonify({'message': 'Category deleted successfully'}), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the income'}), HTTP_SERVER_ERROR)

api.add_resource(Categories, '/categories', '/categories/<int:category_id>')

class Expenses(Resource):
    @authorized
    def post(self):
        #adds new expense
        data = request.get_json()
        title = data.get('title')
        amount = data.get('amount')
        category_id = data.get('category_id')
        float_amount = float(amount)

        category = Category.query.get(category_id)
        if not category:
            return make_response(jsonify({'error': 'Category not found'}), HTTP_NOT_FOUND)
        
        try:
            new_expense = Expense(title=title, amount=float_amount, category=category)
            db.session.add(new_expense)
            db.session.commit()

            return make_response(jsonify(new_expense.to_dict()), HTTP_CREATED)

        except Exception as e:
            print(e)
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while adding this expense'}), HTTP_SERVER_ERROR)
    
    @authorized
    def delete(self, expense_id):
        #deletes expense with provided ID
        expense = Expense.query.get(expense_id)
        if not expense:
            return make_response(jsonify({'error': 'Expense not found'}), HTTP_NOT_FOUND)
        
 
        try:
            db.session.delete(expense)
            db.session.commit() 

            return make_response(jsonify({'message': 'Expense deleted successfully'}), HTTP_SUCCESS)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': 'An error occurred while deleting the expense'}), HTTP_SERVER_ERROR)

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
                return make_response(jsonify(user.to_dict()), HTTP_SUCCESS)
            
        return {'error': 'Invalid Username or Password'}, HTTP_UNAUTHORIZED

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, HTTP_NO_CONTENT)

api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    def get(self):
        #checks session for user_id for auto-login
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            return make_response(jsonify(user.to_dict()), HTTP_SUCCESS)
        return {'error': '401 Unauthroized'}, HTTP_UNAUTHORIZED
    
api.add_resource(CheckSession, '/check_session')

class Testing(Resource):
    def get(self):
        user = User.query.first()
        print(session['user_id'])
        return make_response(jsonify(user.to_dict()), HTTP_SUCCESS)
    
api.add_resource(Testing, '/testing')


if __name__ == '__main__':
    app.run(port=5555, debug=True)