from flask import Blueprint, request, abort, Response
from api.models import auth, dashboard, utils, http_responses


dashboard_controller = Blueprint('dashboard_controller', __name__)


@dashboard_controller.route('/dashboard', methods=['POST'])
@auth.authenticate
def create():
    name = utils.fields_from_request(request, 'name')
    account_id = auth.get_account_id_from_jwt(request)

    data = dashboard.Dashboard.post(name, account_id)
    dash = dashboard.Dashboard.create(data)

    return http_responses.created(dash.json())



