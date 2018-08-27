import json
from flask import Blueprint, request, Response
from api.models import utils, auth, user


user_controller = Blueprint('user_controller', __name__)


@user_controller.route('/users', methods=['GET'])
def get():
    return json.dumps({
        'id': 1,
        'name': 'Cole Sobel'
    })


@user_controller.route('/users', methods=['POST'])
def create():
    data = json.loads(request.data)
    usr = utils.map_to_class(data, user.User)
    result = usr.create()

    response = {
        'success': True,
        'status': 200,
        'user_id': result
    }

    resp = Response(json.dumps(response), status=200, mimetype='application/json')

    return resp

