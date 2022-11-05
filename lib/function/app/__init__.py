from flask import Flask
from flask_cors import CORS

from app.urls import register_apis


def create_app(name: str) -> Flask:
    """
    :param (str) name:
        Nombre de la app
    :return:
        (Flask) Objeto de app de Flask
    """
    app = Flask(name)
    register_apis(app)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    return app
    