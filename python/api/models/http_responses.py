from flask import Response
import json


def unauthenticated():
    res_json = json.dumps({
        'Success': False,
        'Error': 'Unauthenticated'
    })
    return Response(res_json, status=403, mimetype='application/json')

