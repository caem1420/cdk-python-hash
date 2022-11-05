from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask
from flask_apispec import FlaskApiSpec
from flask_restful import Api

from controller.file_hash_controller import FileHashController
from controller.string_hash_controller import StringHashController


def register_urls(api: Api, docs: FlaskApiSpec) -> Api:
    api.add_resource(FileHashController, '/file/<metodo>', endpoint='filehashcontroller')
    docs.register(FileHashController)

    api.add_resource(StringHashController, '/string/<metodo>', endpoint='stringhashcontroller')
    docs.register(StringHashController)
    return api


def configure_swagger(app: Flask) -> Flask:
    app.config.update({
        'APISPEC_SPEC': APISpec(
            title='Hash generator',
            version='v1',
            plugins=[MarshmallowPlugin()],
            openapi_version='2.0.0'
        ),
        'APISPEC_SWAGGER_URL': '/swagger/',  # URI to access API Doc JSON
        'APISPEC_SWAGGER_UI_URL': '/swagger-ui/'  # URI to access UI of API Doc
    })
    return app


def register_apis(app: Flask) -> Flask:
    configure_swagger(app)
    api = Api(app, prefix='/api/v1/hash')
    docs = FlaskApiSpec(app)
    register_urls(api, docs)
    return app