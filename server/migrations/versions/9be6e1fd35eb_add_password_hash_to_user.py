"""Add password hash to user

Revision ID: 9be6e1fd35eb
Revises: 527b6ec6b7ed
Create Date: 2023-06-30 13:49:01.827761

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9be6e1fd35eb'
down_revision = '527b6ec6b7ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('password_hash', sa.String(), nullable=False))

    with op.batch_alter_table('users') as batch_op:
        batch_op.create_unique_constraint('uq_users_name', ['name'])
    


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('uq_users_name', type_='unique')
    
    op.drop_column('users', 'password_hash')

    # ### end Alembic commands ###
