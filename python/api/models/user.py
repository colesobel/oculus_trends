from python.api.models.base_model import BaseModel
from python.api.models import sql, auth, database


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
        SELECT *
        FROM user
        WHERE email = %s
        """
        args = (email, )

        return database.sql_fetch_one(sql, args)




