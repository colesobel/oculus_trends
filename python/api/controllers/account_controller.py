import json
from flask import Blueprint, request, abort, Response
from python.api.models import *



account_controller = Blueprint('account_controller', __name__)



@account_controller.route('/accounts', methods=['POST'])
@auth.authenticate
def create():
    data = json.loads(request.data)
    acc = utils.map_to_class(data, account.Account)
    print(acc)
    response = {
        'success': True,
        'status': 200
    }
    resp = Response(json.dumps(response), status=200, mimetype='application/json')
    resp.set_cookie('cookiekey', 'cookieval')
    return resp


