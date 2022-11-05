from hashing import algorithms
from flask import make_response, request
from flask_apispec import MethodResource, doc, use_kwargs, marshal_with
from flask_restful import Resource

from http import HTTPStatus

from dto.generar_hash_response_dto import GenerarHashResponseDto


class FileHashController(MethodResource, Resource):

    @doc(description='Generar hash a partir de un archivo', tags=['Hash'])
    @marshal_with(GenerarHashResponseDto, code=HTTPStatus.CREATED, description='Hash generado correctamente')
    def post(self, metodo: str):
        request_payload: dict = request.get_json()
        
        if 'nombre' not in request_payload or 'archivo' not in request_payload:
            return make_response({'hash': None, 'descripcion' : 'Faltan parámetros en el cuerpo de la petición'}, HTTPStatus.BAD_REQUEST)
        try:
            if metodo.upper() == 'MD5':
                return make_response(algorithms.generar_md5_from_file(request_payload), HTTPStatus.CREATED)
            elif metodo.upper() == 'SHA1':
                return make_response(algorithms.generar_sha1_from_file(request_payload), HTTPStatus.CREATED)
            elif metodo.upper() == 'SHA256':
                return make_response(algorithms.generar_sha256_from_file(request_payload), HTTPStatus.CREATED)
        except UnicodeDecodeError:
            return make_response(
                {
                    'hash': None,
                    'descripcion' : 'Codificación del archivo no soportada.'
                }, HTTPStatus.UNPROCESSABLE_ENTITY
            )

        return make_response(
            {
                'hash': None,
                'descripcion' : 'El algoritmo no ha sido encontrado.'
            }, HTTPStatus.NOT_FOUND
        )
