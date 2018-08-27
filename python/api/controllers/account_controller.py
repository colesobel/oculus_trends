import json
from flask import Blueprint, request, abort, Response
from api.models import utils, account, auth



account_controller = Blueprint('account_controller', __name__)


# @account_controller.route('/accounts', methods=['POST'])
# def create():
#     data = json.loads(request.data)
#     acc = utils.map_to_class(data, account.Account)
#
#     result = acc.create()
#
#     response = {
#         'success': True,
#         'status': 200,
#         'account_id': result
#     }
#     resp = Response(json.dumps(response), status=200, mimetype='application/json')
#
#     return resp







