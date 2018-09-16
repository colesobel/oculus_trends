import json
from api.models import database, base_model


class Dashboard(base_model.BaseModel):
    def __init__(self, id_, name, account_id, uuid, active):
        super().__init__()
        self.id_ = id_
        self.name = name
        self.account_id = account_id
        self.uuid = uuid
        self.active = active

    def json(self):
        return {
            'id': self.id_,
            'name': self.name,
            'account_id': self.account_id
        }

    @classmethod
    def find(cls, id_):
        sql = """
        SELECT
        id as id_,
        name, 
        account_id, 
        uuid, 
        active
        FROM dashboard
        WHERE id = %s
        """

        result = database.sql_fetch_one(sql, (id_, ))
        return cls(**result)

    @classmethod
    def create(cls, data: dict):
        sql = """
        INSERT INTO dashboard (name, account_id, uuid, created_on)
        VALUES (%s, %s, UUID(), NOW())
        """
        id_ = database.sql_insert(
            sql,
            (
                data.get('name'),
                data.get('account_id')
            )
        )
        return cls.find(id_)

    @staticmethod
    def post(name, account_id):
        """
        should return a dict with all the fields needed to create a record in the "create" method
        """
        result = dict(
            name=name,
            account_id=account_id
        )
        return result
