"""empty message

Revision ID: e3c6cc3e53a2
Revises: dfcd5e626909
Create Date: 2025-05-12 15:42:42.918927

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e3c6cc3e53a2'
down_revision = 'dfcd5e626909'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orgao', schema=None) as batch_op:
        batch_op.add_column(sa.Column('municipio', sa.String(length=200), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orgao', schema=None) as batch_op:
        batch_op.drop_column('municipio')

    # ### end Alembic commands ###
