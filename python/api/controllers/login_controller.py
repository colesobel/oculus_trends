import json
from flask import Blueprint, request, abort, Response, make_response
from api.models import utils, http_responses, auth, account, user, login as lg
from api.models.forms import account_form


login_controller = Blueprint('login_controller', __name__)


@login_controller.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    authenticated_user = lg.login_user(**data)
    if authenticated_user:
        user_data = utils.get_fields_from_dict(authenticated_user, 'user_id', 'email', 'account_id')
        jwt = auth.encode_jwt(data)
        print(jwt)
        print('just printed jwt')
        resp = Response(json.dumps(user_data))
        resp.headers['jwt'] = jwt
        resp.headers['Access-Control-Expose-Headers'] = 'jwt'
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


@login_controller.route('/startup', methods=['GET'])
def startup():
    try:
        jwt = request.headers['jwt']
        email = auth.decode_jwt(jwt)['email']
        info = user.User.get_startup_info(email)
    except:
        return http_responses.not_found()
    else:
        return Response(json.dumps(info))
