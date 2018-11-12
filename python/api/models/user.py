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
    def create(cls, data: dict):
        sql = """
        INSERT INTO user (account_id, email, password, uuid, first_name, last_name, created_on)
        VALUES ( %s, %s, %s, UUID(), %s, %s, NOW())
        """
        id_ = database.sql_insert(
            sql,
            (
                data.get('account_id'),
                data.get('email'),
                data.get('password'),
                data.get('first_name'),
                data.get('last_name')
            )
          )

        return cls.find(id_)

    @staticmethod
    def post(accountId, email, password, firstName, lastName):
        """
        should return a dict with all the fields needed to create a record in the "create" method
        """
        result = dict(
            account_id=accountId,
            email=email,
            password=auth.hash_pw(password),
            first_name=firstName,
            last_name=lastName
        )

        return result


    # @staticmethod
    # def find_by_email(email):
    #     sql = """
    #     SELECT u.id as user_id,
    #     u.email,
    #     u.password,
    #     a.id as account_id,
    #     u.role_id
    #     FROM user u
    #     JOIN account a ON u.account_id = a.id
    #     WHERE email = %s
    #     """
    #     args = (email, )
    #
    #     return database.sql_fetch_one(sql, args)

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
