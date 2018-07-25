from python.api.models.base_model import BaseModel


class Account(BaseModel):
    def __init__(self, name):
        super().__init__()
        self.name = name


