from http import HTTPStatus

from flask import make_response, request
from flask_apispec import MethodResource, doc, marshal_with
from flask_restful import Resource

from dto.generar_hash_response_dto import GenerarHashResponseDto
from hashing import algorithms


class StringHashController(MethodResource, Resource):

    @doc(description='Generar hash a partir de una cadena de texto', tags=['Hash'])
    @marshal_with(GenerarHashResponseDto, code=HTTPStatus.OK, description='Hash generado correctamente')
    def post(self, metodo: str):
        request_payload: dict = request.get_json()
        if 'str' not in request_payload:
            return make_response({'hash': None}, HTTPStatus.BAD_REQUEST)

        if metodo == 'sha256':
            return make_response(algorithms.generar_sha256_from_string(request_payload), HTTPStatus.CREATED)
        elif metodo == 'sha1':
            return make_response(algorithms.generar_sha1_from_string(request_payload), HTTPStatus.CREATED)
        elif metodo == 'md5':
            return make_response(algorithms.generar_md5_from_string(request_payload), HTTPStatus.CREATED)

        return make_response({'hash': None}, HTTPStatus.NOT_FOUND)
