from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import generate_password_hash, check_password_hash

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class BaseModel(db.Model, SerializerMixin):
    __abstract__ = True
    include_timestamps = False

    def to_dict(self, visited=None):
        if visited is None:
            visited = set()

        if self in visited:
            return None

        visited.add(self)

        serialized = {}
        for column in self.__table__.columns:
            serialized[column.name] = getattr(self, column.name)

        if self.include_timestamps:
            serialized['created_at'] = self.created_at
            serialized['updated_at'] = self.updated_at

        for relationship in self.__mapper__.relationships:
            related_obj = getattr(self, relationship.key)
            if related_obj is None:
                serialized[relationship.key] = None
            elif isinstance(related_obj, list):
                serialized[relationship.key] = [obj.to_dict(visited) for obj in related_obj]
            else:
                serialized[relationship.key] = related_obj.to_dict(visited)

        visited.remove(self)
        return serialized

class User(BaseModel):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    budgets = db.relationship('Budget', backref='user')
    password_hash = db.Column(db.String, nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'password' in kwargs:
            self.password_hash = self._generate_password_hash(kwargs['password'])

    def _generate_password_hash(self, password):
        return generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

    def __repr__(self):
        return f'<User {self.name}>'

class Budget(BaseModel):
    __tablename__ = 'budgets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    remaining_amount = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    incomes = db.relationship('Income', backref='budget')
    categories = db.relationship('Category', backref='budget')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return f'<Budget {self.title}>'

class Income(BaseModel):
    __tablename__ = 'incomes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    budget_id = db.Column(db.Integer, db.ForeignKey('budgets.id'))

    include_timestamps = True

    def __repr__(self):
        return f'<Income {self.title}, Amount {self.amount}>'

class Category(BaseModel):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    expenses = db.relationship('Expense', backref='category')

    budget_id = db.Column(db.Integer, db.ForeignKey('budgets.id'))

    def __repr__(self):
        return f'<Category {self.title}, amount {self.amount}>'

class Expense(BaseModel):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    include_timestamps = True

    def to_dict(self, visited=None):
        serialized = {
            'id': self.id,
            'title': self.title,
            'amount': self.amount,
            'category_id': self.category_id,
            'budget_id': self.category.budget_id
        }
        if self.include_timestamps:
            serialized['created_at'] = self.created_at
            serialized['updated_at'] = self.updated_at
        return serialized

    def __repr__(self):
        return f'<Expense {self.title}, amount {self.amount}>'
