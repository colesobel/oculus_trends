import json
from flask import Blueprint, request, abort, Response, make_response
from api.models import utils, http_responses, auth, account, user, login as lg


login_controller = Blueprint('login_controller', __name__)


@login_controller.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    authenticated_user = lg.login_user(**data)
    if authenticated_user:
        user_data = {
            'user_id': authenticated_user.id_,
            'email': authenticated_user.email,
            'account_id': authenticated_user.account_id,
            'role_id': authenticated_user.role_id
        }
        jwt = auth.encode_jwt(**user_data)
        user_data['account_info'] = user.User.get_startup_info(user_data['email'])
        resp = Response(json.dumps(user_data))
        resp.headers['jwt'] = jwt
        resp.headers['Access-Control-Expose-Headers'] = 'jwt'
        return resp
    else:
        return http_responses.unauthenticated()


@login_controller.route('/signup', methods=['POST'])
def signup():
    acc = account.Account.create(request.data)
    usr = user.User.create(acc.id_, request.data)

    jwt = auth.encode_jwt(
        account_id=usr.account_id,
        email=usr.email,
        user_id=usr.id_,
        role_id=usr.role_id
    )

    account_info = user.User.get_startup_info(usr.email)
    data = {
        'account_info': account_info,
        'record': acc.json()
    }
    resp = make_response()
    resp.data = json.dumps(data)
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
