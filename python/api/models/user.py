import json
from concurrent import futures
from api.models.base_model import BaseModel
from api.models import sql, auth, database, utils, database_connection


class User(BaseModel):
    def __init__(self, id_, account_id, role_id, email, password, uuid, first_name, last_name, active):
        super().__init__()
        self.id_ = id_
        self.account_id = account_id
        self.role_id = role_id
        self.email = email
        self.password = password  # This value is hashed
        self.uuid = uuid
        self.first_name = first_name
        self.last_name = last_name
        self.active = active

    def json(self):
        return {
            'id': self.id_,
            'firstName': self.first_name,
            'lastName': self.last_name
        }

    @classmethod
    def find(cls, id_):
        sql = """
        SELECT 
        id as id_, 
        account_id, 
        role_id,
        email, 
        password, 
        uuid, 
        first_name, 
        last_name, 
        active
        FROM user
        WHERE id = %s
        """
        result = database.sql_fetch_one(sql, (id_, ))
        return cls(**result)

    @classmethod
    def create(cls, account_id, data):
        data = json.loads(data)
        insert = dict(
            account_id=account_id, 
            email=data.get('email'), 
            password=data.get('password'), 
            first_name=data.get('firstName'),
            last_name=data.get('lastName')
        )
        sql = """
        INSERT INTO user (account_id, email, password, uuid, first_name, last_name, created_on)
        VALUES ( %s, %s, %s, UUID(), %s, %s, NOW())
        """
        id_ = database.sql_insert(
            sql,
            (
                insert['account_id'],
                insert['email'],
                insert['password'],
                insert['first_name'],
                insert['last_name']
            )
          )

        return cls.find(id_)

    @classmethod
    def find_by_email(cls, email):
        sql = """
        SELECT 
        id as id_, 
        account_id, 
        role_id,
        email, 
        password, 
        uuid, 
        first_name, 
        last_name, 
        active
        FROM user
        WHERE email = %s
        """
        result = database.sql_fetch_one(sql, (email, ))
        return cls(**result)

    @staticmethod
    def get_startup_info(email):
        sql = """
        SELECT 
        u.first_name AS user_first_name, 
        u.id as user_id,
        a.name AS account_name, 
        a.id as account_id,
        u.role_id as role_id,
        d.id AS dashboard_id, 
        d.name AS dashboard_name
        FROM `user` u
        JOIN account a ON u.account_id = a.id
        LEFT JOIN dashboard d ON a.id = d.account_id
        WHERE u.email = %s;
        """
        args = (email, )
        with futures.ThreadPoolExecutor(max_workers=2) as executor:
            result = executor.submit(database.sql_fetch_all, sql, args)
            dbcs = executor.submit(database_connection.DatabaseConnection.get_all_for_email, email)

        result = result.result()

        dashboards = []
        for d in result:
            if d.get('dashboard_id'):
                db = {
                    'id': d['dashboard_id'],
                    'name': d['dashboard_name'],
                    'url_alias': utils.to_url_alias(d['dashboard_name'])
                }
                dashboards.append(db)

        dbcs = dbcs.result()

        startup_info = {
            'first_name': result[0]['user_first_name'],
            'user_id': result[0]['user_id'],
            'account_name': result[0]['account_name'],
            'account_id': result[0]['account_id'],
            'role_id': result[0]['role_id'],
            'dashboards': dashboards,
            'dbcs': [dbc.json() for dbc in dbcs]
        }

        return startup_info

    @classmethod
    def get_all_for_account_id(cls, account_id):
        sql = """
        SELECT id
        FROM `user`
        WHERE account_id = %s
        AND user.deleted = 0
        AND user.active = 1
        """
        args = (account_id, )

        results = database.sql_fetch_all(sql, args)
        user_ids = [u['id'] for u in results]
        if not user_ids:
            return []

        max_workers = min(20, len(user_ids))
        with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            users = executor.map(cls.find, user_ids)
            return [u for u in users]
