from app import app
from models import db, User, Budget, Income, Category, Expense

with app.app_context():

    User.query.delete()
    Budget.query.delete()
    Income.query.delete()
    Category.query.delete()
    Expense.query.delete()

    parker = User(name='Parker', email='parkerparham@yahoo.com')
    parker.password_hash = parker._generate_password_hash('hello_world')
    db.session.add(parker)

    budget1 = Budget(title='July 2023', user=parker)
    db.session.add(budget1)

    income1 = Income(title='First paycheck', amount=1200, budget=budget1)
    db.session.add(income1)
    income2 = Income(title='second paycheck', amount=1220, budget=budget1)
    db.session.add(income2)

    category1 = Category(title='food', amount=500, budget=budget1)
    db.session.add(category1)
    category2 = Category(title='house', amount=900, budget=budget1)
    db.session.add(category2)

    expense1 = Expense(title='groceries', amount=127.5, category=category1)
    db.session.add(expense1)
    expense2 = Expense(title='dinner at trios', amount=92.7, category=category1)
    db.session.add(expense2)
    expense3 = Expense(title='new vacuum', amount=92.7, category=category2)
    db.session.add(expense3)
    expense4 = Expense(title='cleaning products', amount=50, category=category2)
    db.session.add(expense4)

    db.session.commit()
    