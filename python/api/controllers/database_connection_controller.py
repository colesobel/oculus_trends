import json
from flask import Blueprint, request, abort, Response
from api.models import auth, database_connection, http_responses, utils


database_connection_controller = Blueprint('database_connection_controller', __name__)


@database_connection_controller.route('/db_conn', methods=['POST'])
@auth.authenticate
def create():
    data = json.loads(request.data)
    account_id = auth.get_account_id_from_jwt(request)
    data['accountId'] = account_id
    db_conn_data = database_connection.DatabaseConnection.post(**data)
    test_result = database_connection.DatabaseConnection.test_connection(db_conn_data)
    if not test_result:  # Client credentials not good
        resp = Response(json.dumps({
            'Sucess': False,
            'Error': 'Client Database Connection Failed'
        }))
        resp.status_code = 424
        return resp

    else:
        connection = database_connection.DatabaseConnection.create(db_conn_data)
        return http_responses.created(connection.json())


@database_connection_controller.route('/db_conn/<int:_id>', methods=['DELETE'])
@auth.authenticate
@auth.authorize(1)
def delete(_id):
    account_id = auth.get_account_id_from_jwt(request)
    print('account_id: {}'.format(account_id))
    database_connection.DatabaseConnection.delete(_id, account_id)
    return http_responses.success()