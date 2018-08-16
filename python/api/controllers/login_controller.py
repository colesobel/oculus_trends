import json
from flask import Blueprint, request, abort, Response, make_response
from python.api.models import utils, http_responses, auth, account, login as lg
from python.api.models.forms import account_form


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
    account_data = account_form.post(**data)
    jwt = auth.encode_jwt(account_data)

    resp = make_response()
    resp.data = json.dumps(account_data)
    resp.mimetype = 'application/json'
    resp.status_code = 201
    resp.headers['jwt'] = jwt
    resp.headers['Access-Control-Expose-Headers'] = 'jwt'
    return resp



@login_controller.route('/testing', methods=['GET'])
def testit():
    resp = make_response()
    resp.status_code = 403
    return resp
