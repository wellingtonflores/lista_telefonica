from flask import jsonify, render_template, request, redirect, url_for, flash, Blueprint
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from app.models import Orgao, Setor, Divisao

bp = Blueprint("main", __name__)


@bp.route("/")
@bp.route("/index")
def index():
    return render_template("lista_telefonica_aprimorada.html")


from sqlalchemy import or_, and_


@bp.route("/api/orgao", methods=["GET"])
def get_orgao():
    orgaos = Orgao.query.options(
        joinedload(Orgao.divisoes).joinedload(Divisao.setores),
        joinedload(Orgao.setores),
    ).all()

    data = []
    for orgao in orgaos:
        orgao_data = {
            "idOrgao": orgao.id,
            "nomeOrgao": orgao.nome,
            "enderecoOrgao": orgao.endereco,
            "municipio": orgao.municipio,
            "divisoes": [
                {
                    "idDivisao": d.id,
                    "nomeDivisao": d.nome,
                    "setores": [
                        {
                            "idSetor": s.id,
                            "nomeSetor": s.nome,
                            "telefoneSetor": s.telefone,
                        }
                        for s in d.setores
                    ],
                }
                for d in orgao.divisoes
            ],
            "setores": [
                {"idSetor": s.id, "nomeSetor": s.nome, "telefoneSetor": s.telefone}
                for s in orgao.setores
                if s.divisao_id is None
            ],
        }
        data.append(orgao_data)

    return jsonify(data)
