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
    data = json.loads(request.data)
    account_data = account.Account.post(accountName=data.get('accountName'))
    acc = account.Account.create(account_data)
    user_data = user.User.post(
        accountId=acc.id_,
        email=data.get('email'),
        password=data.get('password'),
        firstName=data.get('firstName'),
        lastName=data.get('lastName')
    )
    usr = user.User.create(user_data)

    jwt = auth.encode_jwt(
        account_id=usr.account_id,
        email=usr.email,
        user_id=usr.id_,
        role_id=usr.role_id
    )

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
