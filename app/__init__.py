from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///lista_telefonica.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializa a extensão com a instância importada
    from app.models import db, Divisao, Setor, Orgao

    db.init_app(app)
    migrate.init_app(app, db)

    # Registra blueprints/rotas
    from app.routes import bp

    app.register_blueprint(bp)

    return app
