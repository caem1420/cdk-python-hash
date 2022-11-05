from marshmallow import Schema, fields


class GenerarHashResponseDto(Schema):
    hash = fields.Str(required=True, description='Hash generado')
