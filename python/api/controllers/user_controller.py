import json
from flask import Blueprint, request


user_controller = Blueprint('user_controller', __name__)


@user_controller.route('/users', methods=['GET'])
def get():
    return json.dumps({
        'id': 1,
        'name': 'Cole Sobel'
    })