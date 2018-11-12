from flask import Flask, request
from flask_cors import CORS
from api.controllers import *


app = Flask(__name__)
CORS(app)
app.register_blueprint(user_controller.user_controller)
app.register_blueprint(account_controller.account_controller)
app.register_blueprint(login_controller.login_controller)
app.register_blueprint(dashboard_controller.dashboard_controller)
app.register_blueprint(database_connection_controller.database_connection_controller)
app.register_blueprint(chart_controller.chart_controller)