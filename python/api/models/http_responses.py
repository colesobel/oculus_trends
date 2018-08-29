from flask import Response
import json


def unauthenticated():
    res_json = json.dumps({
        'Success': False,
        'Error': 'Unauthenticated'
    })
    return Response(res_json, status=401, mimetype='application/json')


def not_found():
    res_json = json.dumps({
        'Success': False,
        'Error': 'Not Found'
    })
    resp = Response(res_json)
    resp.status_code = 404
    return resp

