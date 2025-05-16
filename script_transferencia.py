from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String

# Base para os modelos
Base = declarative_base()

# Modelo da tabela 'orgaos' no PostgreSQL
class Orgaos(Base):
    __tablename__ = 'orgaos'

    id = Column(Integer, primary_key=True)
    logradouro = Column(String)
    numero = Column(String)
    complemento = Column(String)
    bairro = Column(String)
    cidade = Column(String)
    cep = Column(String)
    telefone = Column(String)
    email = Column(String)
    orgao_emissor = Column(String)

# Modelo da tabela 'orgao' no SQLite
class Orgao(Base):
    __tablename__ = 'orgao'

    id = Column(Integer, primary_key=True)
    logradouro = Column(String)
    numero = Column(String)
    complemento = Column(String)
    bairro = Column(String)
    cidade = Column(String)
    cep = Column(String)
    telefone = Column(String)
    email = Column(String)
    nome = Column(String)

# Conexão com PostgreSQL (use seu usuário, senha e host/porta corretos)
pg_engine = create_engine('postgresql+pg8000://dtip:njrYG25zsAJd4TxcU396hK@localhost:5433/docpc')
PGSession = sessionmaker(bind=pg_engine)
pg_session = PGSession()

# Conexão com SQLite
sqlite_engine = create_engine('sqlite:///instance/lista_telefonica.db')
SQLiteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLiteSession()

# Cria a tabela 'orgao' em SQLite, se ainda não existir
Base.metadata.create_all(sqlite_engine)

# Limpa registros antigos da tabela 'orgao'
sqlite_session.execute(text("DELETE FROM orgao"))
sqlite_session.commit()

# Busca todos os registros da tabela 'orgaos' no PostgreSQL
orgaos_pg = pg_session.query(Orgaos).all()

# Insere cada registro em SQLite, preservando o id original
for o in orgaos_pg:
    novo = Orgao(
        id=o.id,
        logradouro=o.logradouro,
        numero=o.numero,
        complemento=o.complemento,
        bairro=o.bairro,
        cidade=o.cidade,
        cep=o.cep,
        telefone=o.telefone,
        email=o.email,
        nome=o.orgao_emissor
    )
    sqlite_session.add(novo)

# Confirma a transação
sqlite_session.commit()

print("Migração concluída com sucesso, IDs preservados!")
