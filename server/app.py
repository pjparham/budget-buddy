from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_bcrypt import Bcrypt

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

        if not name or not password:
            return make_response(jsonify({'error': 'name and password are required fields'}), 400)

        existing_user = User.query.filter_by(name=name).first()
        if existing_user:
            return make_response(jsonify({'error': 'user already exists'}), 409)

        new_user = User(name=name, password=password)
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify({'message': 'user created successfully'}), 201)


api.add_resource(Users, '/users')


if __name__ == '__main__':
    app.run(port=5555, debug=True)