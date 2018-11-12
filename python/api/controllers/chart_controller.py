import json
from flask import Blueprint, request, abort, Response
from api.models import auth, database_connection, http_responses


chart_controller = Blueprint('chart_controller', __name__)


@chart_controller.route('/chart', methods=['POST'])
@auth.authenticate
def create():
    print(request.data)
    account_id = auth.get_field_from_jwt(request, 'account_id')



    return 'hi girl'


@chart_controller.route('/chart-test', methods=['POST'])
@auth.authenticate
@auth.authorize(1)
def test():
    print(request.data)
    data = json.loads(request.data)
    account_id = auth.get_field_from_jwt(request, 'account_id')
    dbc = database_connection.DatabaseConnection.find(data.get('dbcId'), account_id)
    query = data.get('query')
    results = dbc.run_query(query)

    return http_responses.query_success_result(results)

