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
            return make_response(jsonify({'error': 'name, email, and password are required fields'}), 400)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return make_response(jsonify({'error': 'user already exists'}), 409)

        new_user = User(name=name, password=password, email=email)
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify({'message': 'user created successfully'}), 201)


api.add_resource(Users, '/users')

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
            
        return {'error': '401 Unauthorized'}, 401

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
        return make_response(jsonify(user.to_dict()), 200)
    
api.add_resource(Testing, '/testing')


if __name__ == '__main__':
    app.run(port=5555, debug=True)