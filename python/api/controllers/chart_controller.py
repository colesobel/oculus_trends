import json
from flask import Blueprint, request, abort, Response
from api.models import auth, database_connection, http_responses
from api.models.chart import Chart


chart_controller = Blueprint('chart_controller', __name__)


@chart_controller.route('/chart', methods=['POST'])
@auth.authenticate
def create():
    # TODO verify that dbcId is for this accountId?
    print(request.data)
    account_id = auth.get_field_from_jwt(request, 'account_id')
    chart = Chart.create(account_id, request.data)
    return http_responses.created(chart.json())


@chart_controller.route('/chart-test', methods=['POST'])
@auth.authenticate
@auth.authorize(1)
def test():
    print(request.data)
    data = json.loads(request.data)


    dbc = database_connection.DatabaseConnection.find(data.get('dbcId'))
    query = data.get('query')
    results = dbc.run_query(query)

    return http_responses.query_success_result(results)


@chart_controller.route('/chart/<int:id_>/run', methods=['GET'])
@auth.authenticate
def run_query(id_):
    refresh = request.args.get('refresh')
    refresh = True if refresh and refresh == '1' else False
    chart = Chart.find(id_)
    results = chart.run_query(refresh)

    return Response(
        json.dumps(
            {
                'results': results
            }
        )
    )