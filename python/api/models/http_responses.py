from flask import Response
import json
from api.models.utils import to_json


def unauthenticated():
    res_json = to_json({
        'Success': False,
        'Error': 'Unauthenticated'
    })
    return Response(res_json, status=401, mimetype='application/json')


def unauthorized():
    print('returning unauthorized')
    res_json = to_json({
        'Success': False,
        'Error': 'Unauthorized'
    })
    return Response(res_json, status=403, mimetype='application/json')


def not_found():
    res_json = to_json({
        'Success': False,
        'Error': 'Not Found'
    })
    resp = Response(res_json)
    resp.status_code = 404
    resp.mimetype = 'application/json'
    return resp


def created(record: dict):
    res_json = to_json(dict(
        Success=True,
        Status=201,
        record=record
    ))
    resp = Response(res_json)
    resp.status_code = 201
    resp.mimetype = 'application/json'
    return resp


def success():
    res_json = to_json(dict(
        Success=True,
        Status=200
    ))
    return Response(res_json, status=200, mimetype='application/json')


def query_success_result(results: list):
    res_json = to_json({
        'success': True,
        'status': 200,
        'results': results
    })

    return Response(res_json, status=200, mimetype='application/json')


