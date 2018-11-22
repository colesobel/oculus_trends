import json
from flask import Blueprint, request, abort, Response
from api.models import auth, database_connection, http_responses
from api.models.chart import Chart
from api.models.utils import to_json


chart_controller = Blueprint('chart_controller', __name__)


@chart_controller.route('/chart', methods=['POST'])
@auth.authenticate
def create():
    # TODO verify that dbcId is for this accountId?
    account_id = auth.get_field_from_jwt(request, 'account_id')
    chart = Chart.create(account_id, request.data)
    return http_responses.created(chart.json())


@chart_controller.route('/chart-test', methods=['POST'])
@auth.authenticate
@auth.authorize(1)
def test():
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
        to_json(
            {
                'results': results
            }
        )
    )


@chart_controller.route('/chart/<int:id_>/spec', methods=['PUT'])
@auth.authenticate
def update_size_placement(id_):
    chart = Chart.find(id_)
    chart.update(json.loads(request.data))
    chart = Chart.find(id_)

    data = {
        'result': chart.json_full()
    }
    return Response(to_json(data))
