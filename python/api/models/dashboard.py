import json
from concurrent import futures
from api.models import database, base_model, utils, chart


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
            'url_alias': utils.to_url_alias(self.name)
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

    @staticmethod
    def get_all_charts(account_id, dashboard_id):
        sql = """
        SELECT c.id
        FROM chart c
        JOIN dashboard d ON c.dashboard_id = d.id
        WHERE d.account_id = %s
        AND d.id = %s
        AND d.active = 1
        AND d.deleted = 0
        AND c.active = 1
        AND c.deleted = 0
        """
        args = (account_id, dashboard_id)
        results = database.sql_fetch_all(sql, args)
        chart_ids = [r['id'] for r in results]
        if not chart_ids:
            return []

        max_workers = len(chart_ids)
        with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            results = executor.map(chart.Chart.find, chart_ids, timeout=20)
            return [r for r in results]





