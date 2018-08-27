import json
from flask import Blueprint, request, abort, Response
from api.models import auth, database_connection, http_responses


database_connection_controller = Blueprint('database_connection_controller', __name__)


@database_connection_controller.route('/db_conn', methods=['POST'])
@auth.authenticate
def create():
    data = json.loads(request.data)
    account_id = auth.get_account_id_from_jwt(request)
    print(account_id)
    print(data)
    db_conn = database_connection.DatabaseConnection.post(**data)
    connection_test_result = db_conn.test_connection()
    if not connection_test_result:

        resp = Response(json.dumps({
            'Sucess': False,
            'Error': 'Client Database Connection Failed'
        }))
        resp.status_code = 424
        return resp
    else:
        db_conn.create()
        resp = Response(db_conn.json_success())
        resp.status_code = 201
        return resp


