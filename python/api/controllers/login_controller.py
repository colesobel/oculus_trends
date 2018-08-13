import json
from flask import Blueprint, request, abort, Response
from python.api.models import utils, http_responses, auth, account, login as lg


login_controller = Blueprint('login_controller', __name__)


@login_controller.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    authenticated_user = lg.login_user(**data)
    if authenticated_user:
        user_data = utils.get_fields_from_dict(authenticated_user, 'id', 'email', 'first_name', 'last_name')
        jwt = auth.encode_jwt(data)

        resp = Response(json.dumps(user_data))
        resp.set_cookie('oculus_session', jwt)
        return resp
    else:
        return http_responses.unauthenticated()


@login_controller.route('/signup', methods=['POST'])
def signup():
    data = json.loads(request.data)
    account_data = {'name': data['accountName']}
    acc = utils.map_to_class(account_data, account.Account)
    account_id = acc.create()
    

    resp = Response(json.dumps({'mess': 'hi'}))
    return resp

