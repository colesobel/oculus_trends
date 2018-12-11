import json
from api.models.base_model import BaseModel
from api.models.sql import single_insert
from api.models import user, database


class Account(BaseModel):
    def __init__(self, id_, name, uuid, active):
        super().__init__()
        self.id_ = id_
        self.name = name
        self.uuid = uuid
        self.active = active

    def json(self):
        return {
            'id': self.id_,
            'name': self.name
        }

    @classmethod
    def create(cls, data):
        data = json.loads(data)
        insert = dict(
            name=data.get('accountName')
        )
        sql = """
        INSERT INTO account (name, uuid, created_on)
        VALUES (%s, UUID(), NOW())        
        """
        id_ = database.sql_insert(
            sql,
            (
                insert['name']
            )
        )
        return cls.find(id_)


    # @staticmethod
    # def post(accountName): #, firstName, lastName, email, password):
    #     """
    #     should return a dict with all the fields needed to create a record in the "create" method
    #     """
    #     result = dict(
    #         name=accountName
    #     )
    #     return result

