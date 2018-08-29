from api.models.base_model import BaseModel
from api.models import sql, auth, database


class User(BaseModel):
    def __init__(self, account_id, email, password, first_name, last_name):
        super().__init__()
        self.account_id = account_id
        self.email = email
        self.password = auth.hash_pw(password)
        self.first_name = first_name
        self.last_name = last_name

        self.timestamp_defaults = ['created_on']
        self.columns = self.class_parameters
        self.values = [self.__dict__.get(p) for p in self.class_parameters]

    def create(self):
        result = sql.single_insert(table=self.table_name,
                                   columns=self.columns,
                                   values=self.values,
                                   timestamps=self.timestamp_defaults,
                                   uuid=True)
        return result

    @staticmethod
    def find_by_email(email):
        sql = """
        SELECT u.id as user_id,
        u.email, 
        u.password,
        a.id as account_id
        FROM user u
        JOIN account a ON u.account_id = a.id
        WHERE email = %s
        """
        args = (email, )

        return database.sql_fetch_one(sql, args)

    @staticmethod
    def get_startup_info(email):
        sql = """
        SELECT u.first_name AS user_first_name, 
        u.id as user_id,
        a.name AS account_name, 
        a.id as account_id,
        d.id AS dashboard_id, 
        d.name AS dashboard_name
        FROM `user` u
        JOIN account a ON u.account_id = a.id
        LEFT JOIN dashboard d ON a.id = d.account_id
        WHERE u.email = %s;
        """
        args = (email, )
        result = database.sql_fetch_all(sql, args)

        startup_info = {
            'first_name': result[0]['user_first_name'],
            'user_id': result[0]['user_id'],
            'account_name': result[0]['account_name'],
            'account_id': result[0]['account_id'],
            'dashboards': [{'id': d['dashboard_id'],
                            'name': d['dashboard_name']}
                           for d in result] if result[0]['dashboard_id'] else []
        }

        return startup_info



User.get_startup_info('b@a.com')


