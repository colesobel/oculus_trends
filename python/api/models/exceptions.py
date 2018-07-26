import json


class ClientException(Exception):
    def __init__(self, message, code):
        self.message = message
        self.code = 400

    def json(self):
        return json.dumps(
            {
                'status_code': self.code,
                'error': self.message
            }
        )

    def __str__(self):
        return self.message
