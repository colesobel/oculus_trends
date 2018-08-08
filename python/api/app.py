from flask import Flask, request
from flask_cors import CORS
from python.api.controllers import *


app = Flask(__name__)
CORS(app)
app.register_blueprint(user_controller.user_controller)
app.register_blueprint(account_controller.account_controller)
app.register_blueprint(login_controller.login_controller)