import json
from flask import Blueprint, request, Response
from api.models import utils, auth
from api.models.user import User
from api.models.utils import to_json


user_controller = Blueprint('user_controller', __name__)


@user_controller.route('/users', methods=['GET'])
@auth.authenticate
def list_all():
    account_id = auth.get_field_from_jwt(request, 'account_id')
    raw_users = User.get_all_for_account_id(account_id)
    users = [u.json() for u in raw_users]

    data = to_json({
        'results': users
    })

    return Response(data)


@user_controller.route('/users', methods=['POST'])
def create():
    data = json.loads(request.data)
    usr = utils.map_to_class(data, User)
    result = usr.create()

    response = {
        'success': True,
        'status': 200,
        'user_id': result
    }

    resp = Response(json.dumps(response), status=200, mimetype='application/json')

    return resp

