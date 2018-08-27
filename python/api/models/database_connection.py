import json
import pymysql
import psycopg2 as ps
from psycopg2.extras import RealDictCursor
from api.models.database import client_mysql_fetch_all

class DatabaseConnection:
    def __init__(self, connection_name, database_server, database_name, host, user, password, port):
        self.connection_name = connection_name
        self.database_server = database_server
        self.database_name = database_name
        self.host = host
        self.user = user
        self.password = password
        self.port = int(port)


        if not port:
            if database_server == 'postgres':
                port = 5432
            elif database_server == 'redshift':
                port = 5439
            else:  # MySQL
                port = 3306
        print(database_server, database_name, host, user, password, port)

    def test_connection(self):
        query = "SELECT 1;"
        try:
            if self.database_server in ['redshift', 'postgres']:
                connection = self.connect_to_postgres()
            else:  # MySQL
                connection = self.connect_to_mysql()
                result = client_mysql_fetch_all(connection, query, ())
        except Exception as e:
            print('Database connection error!')
            print(e)
            return False
        else:
            print('connection successful')
            return True

    def connect_to_mysql(self):
        return pymysql.connect(host=self.host,
                               port=self.port,
                               user=self.user,
                               password=self.password,
                               database=self.database_name,
                               use_unicode=True,
                               charset="utf8",
                               local_infile=True,
                               cursorclass=pymysql.cursors.DictCursor)

    def connect_to_postgres(self):
        return ps.connect(host=self.host,
                          port=self.port,
                          user=self.user,
                          password=self.password,
                          dbname=self.database_name)

    def create(self):
        pass

    @classmethod
    def post(cls, connectionName, databaseServer, databaseName, host, user, password, port):
        db_conn = cls(connection_name=connectionName,
                      database_server=databaseServer,
                      database_name=databaseName,
                      host=host,
                      user=user,
                      password=password,
                      port=port)
        return db_conn

    @staticmethod
    def json_success():
        return json.dumps({
            'Success': True
        })





# connection = ps.connect(dbname='appthis', host='batman.ctdsfkofgm52.us-west-2.redshift.amazonaws.com',
#                         port=5439, user='root', password='Mah14Mah1')
#
#
# sql = 'select * from rollup_offer_link_hour limit 100'
#
#
# cur = connection.cursor()
# dict_cursor = connection.cursor(cursor_factory=RealDictCursor)
# dict_cursor.execute(sql)
# result = dict_cursor.fetchall()
