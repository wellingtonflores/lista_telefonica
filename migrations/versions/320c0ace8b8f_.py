"""empty message

Revision ID: 320c0ace8b8f
Revises: e3c6cc3e53a2
Create Date: 2025-05-14 15:22:49.053186

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '320c0ace8b8f'
down_revision = 'e3c6cc3e53a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orgao', schema=None) as batch_op:
        batch_op.add_column(sa.Column('logradouro', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('numero', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('complemento', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('bairro', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('cidade', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('cep', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('telefone', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('email', sa.String(length=100), nullable=True))
        batch_op.drop_column('endereco')
        batch_op.drop_column('municipio')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orgao', schema=None) as batch_op:
        batch_op.add_column(sa.Column('municipio', sa.VARCHAR(length=200), nullable=True))
        batch_op.add_column(sa.Column('endereco', sa.VARCHAR(length=200), nullable=True))
        batch_op.drop_column('email')
        batch_op.drop_column('telefone')
        batch_op.drop_column('cep')
        batch_op.drop_column('cidade')
        batch_op.drop_column('bairro')
        batch_op.drop_column('complemento')
        batch_op.drop_column('numero')
        batch_op.drop_column('logradouro')

    # ### end Alembic commands ###
