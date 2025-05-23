from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Orgao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    logradouro= db.Column(db.String(200), nullable=True)
    numero = db.Column(db.Integer, nullable=False)
    complemento = db.Column(db.String(100), nullable = True)
    bairro = db.Column(db.String(100), nullable = True)
    cidade = db.Column(db.String(200), nullable=True)
    cep = db.Column(db.String(100), nullable = True)
    telefone = db.Column(db.String(100), nullable = True)
    email = db.Column(db.String(100), nullable = True)

    divisoes = db.relationship(
        "Divisao", back_populates="orgao", cascade="all, delete-orphan"
    )
    setores = db.relationship(
        "Setor", back_populates="orgao", cascade="all, delete-orphan"
    )


class Divisao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    orgao_id = db.Column(db.Integer, db.ForeignKey("orgao.id"), nullable=False)

    orgao = db.relationship("Orgao", back_populates="divisoes")
    setores = db.relationship(
        "Setor", back_populates="divisao", cascade="all, delete-orphan"
    )


class Setor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=True)

    divisao_id = db.Column(db.Integer, db.ForeignKey("divisao.id"), nullable=True)
    orgao_id = db.Column(db.Integer, db.ForeignKey("orgao.id"), nullable=False)

    divisao = db.relationship("Divisao", back_populates="setores")
    orgao = db.relationship("Orgao", back_populates="setores")
