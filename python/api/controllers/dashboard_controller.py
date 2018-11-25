import json
from flask import Blueprint, request, abort, Response
from api.models import auth, utils, http_responses, user
from api.models.dashboard import Dashboard


dashboard_controller = Blueprint('dashboard_controller', __name__)


@dashboard_controller.route('/dashboard', methods=['POST'])
@auth.authenticate
def create():
    name = utils.fields_from_request(request, 'name')
    account_id = auth.get_field_from_jwt(request, 'account_id')

    data = Dashboard.post(*name, account_id)
    dash = Dashboard.create(data)

    return http_responses.created(dash.json())


@dashboard_controller.route('/dashboard/<int:id_>/charts', methods=['GET'])
@auth.authenticate
def get_charts(id_):
    account_id = auth.get_field_from_jwt(request, 'account_id')
    raw_charts = Dashboard.get_all_charts(account_id, id_)
    charts = [c.json_full() for c in raw_charts]

    return Response(utils.to_json(
        {
            'charts': charts
        }
    ))


