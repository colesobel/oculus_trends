import json
import pymysql
import psycopg2 as ps
from psycopg2.extras import RealDictCursor
from cryptography.fernet import Fernet
from api.models.database import client_mysql_fetch_all, sql_insert, sql_fetch_one
from api.models import auth, utils


class DatabaseConnection:
    def __init__(
        self,
        id_,
        connection_name,
        database_server,
        database_name,
        host,
        user,
        password,
        port,
        account_id
    ):
        self.connection_name = connection_name
        self.database_server = database_server
        self.database_name = database_name
        self.host = host
        self.user = user
        self.password = password
        self.port = int(port)
        self.id_ = id_
        self.account_id = account_id

        if not port:
            if database_server == 'postgres':
                port = 5432
            elif database_server == 'redshift':
                port = 5439
            else:  # MySQL
                port = 3306
        print(database_server, database_name, host, user, password, port)

    def json(self):
        return json.dumps({
            'id': self.id_,
            'name': self.connection_name
        })

    @staticmethod
    def connect_to_mysql(connection_info):
        return pymysql.connect(
            host=connection_info['host'],
            port=connection_info['port'],
            user=connection_info['user'],
            password=connection_info['password'],
            database=connection_info['database_name'],
            # use_unicode=True,
            # charset="utf8",
            local_infile=True,
            cursorclass=pymysql.cursors.DictCursor
        )

    @staticmethod
    def connect_to_postgres(connection_info):
        return ps.connect(
            host=connection_info['host'],
            port=connection_info['port'],
            user=connection_info['user'],
            password=connection_info['password'],
            dbname=connection_info['database_name']
        )

    @classmethod
    def create(cls, data: dict):
        """
        Encrypts and saves a database connection to db
        """
        dbc_sql = """
        INSERT INTO dbc (`uuid`, 
        `name`, 
        `account_id`, 
        `db_server`, 
        `db_name`, 
        `host`, 
        `user`, 
        `password`, 
        `port`, 
        `created_on`)
        VALUES (
        UUID(),
        %s, 
        %s, 
        %s,
        %s, 
        %s, 
        %s, 
        %s, 
        %s, 
        NOW()  
        )
        """
        dbc_args = (
            data['connection_name'],
            data['account_id'],
            auth.aes_encrypt(
                auth.fernet_encrypt(data['database_server'], key=data['f_key']).cipher_text,
                key=data['a_key'],
                iv=data['iv']
            ).cipher_text,
            auth.aes_encrypt(
                auth.fernet_encrypt(data['database_name'], key=data['f_key']).cipher_text,
                key=data['a_key'],
                iv=data['iv']).cipher_text,
            auth.aes_encrypt(
                auth.fernet_encrypt(data['host'], key=data['f_key']).cipher_text,
                key=data['a_key'],
                iv=data['iv']).cipher_text,
            auth.aes_encrypt(
                auth.fernet_encrypt(data['user'], key=data['f_key']).cipher_text,
                key=data['a_key'],
                iv=data['iv']).cipher_text,
            auth.aes_encrypt(
                auth.fernet_encrypt(data['password'], key=data['f_key']).cipher_text,
                key=data['a_key'],
                iv=data['iv']).cipher_text,
            data['port']
        )
        id_ = sql_insert(dbc_sql, dbc_args)
        key_sql = """
        INSERT INTO dbc_key (`uuid`, 
        `dbc_id`, 
        `a_key`, 
        `f_key`, 
        `iv`, 
        `created_on`)
        VALUES (UUID(), 
        %s, 
        %s, 
        %s, 
        %s, 
        NOW())
        """
        key_args = (
            id_,
            data['a_key'],
            data['f_key'].decode('utf-8'),
            data['iv']
        )

        sql_insert(key_sql, key_args)

        return cls.find(id_)

    @classmethod
    def test_connection(cls, connection_info):
        query = "SELECT 1;"
        try:
            if connection_info['database_server'] in ['redshift', 'postgres']:
                connection = cls.connect_to_postgres(connection_info)
            else:  # MySQL
                connection = cls.connect_to_mysql(connection_info)
                result = client_mysql_fetch_all(connection, query, ())
        except Exception as e:
            print('Database connection error!')
            print(e)
            return False
        else:
            print('connection successful')
            return True

    @staticmethod
    def post(accountId, connectionName, databaseServer, databaseName, host, user, password, port):
        """
        Returns a dict with all the fields needed to create a record in the "create" method.
        The return dict can also be passed to "test_connection"
        """
        connection_info = dict(
            account_id=accountId,
            connection_name=connectionName,
            database_server=databaseServer,
            database_name=databaseName,
            host=host,
            user=user,
            password=password,
            port=int(port),
            a_key=auth.create_salt(),
            iv=auth.create_salt(),
            f_key=Fernet.generate_key()
        )
        return connection_info

    @classmethod
    def find(cls, id_):
        """
        Creates an instance of DatabaseConnection from database
        """
        query = """
        SELECT dbc.id AS id_, 
        dbc.account_id, 
        dbc.name as connection_name, 
        dbc.db_server as database_server, 
        dbc.db_name as database_name, 
        dbc.host,
        dbc.user, 
        dbc.password, 
        dbc.port, 
        dbck.a_key, 
        dbck.iv, 
        dbck.f_key
        FROM dbc
        JOIN dbc_key dbck ON dbc.id = dbck.dbc_id
        WHERE dbc.id = %s
        """
        dbc = sql_fetch_one(query, (id_, ))
        if not dbc:
            return None
        a_key, iv, f_key = dbc['a_key'], dbc['iv'], dbc['f_key']
        dbc_args = utils.get_fields_from_dict(
            dbc,
            'id_',
            'account_id',
            'connection_name',
            ('database_server', auth.decrypt_all, a_key, iv, f_key),
            ('database_name', auth.decrypt_all, a_key, iv, f_key),
            ('host', auth.decrypt_all, a_key, iv, f_key),
            ('user', auth.decrypt_all, a_key, iv, f_key),
            ('password', auth.decrypt_all, a_key, iv, f_key),
            'port'
        )
        return cls(**dbc_args)

    @classmethod
    def get_all_for_account_id(cls, account_id):
        pass





# connection = ps.connect(dbname='appthis', host='batman.ctdsfkofgm52.us-west-2.redshift.amazonaws.com',
#                         port=5439, user='root', password='Mah14Mah1')



# sql = 'select * from rollup_offer_link_hour limit 100'
#
#
# cur = connection.cursor()
# dict_cursor = connection.cursor(cursor_factory=RealDictCursor)
# dict_cursor.execute(sql)
# result = dict_cursor.fetchall()

# dbcon = DatabaseConnection.post(
#     accountId=48,
#     connectionName='new',
#     databaseServer='mysql',
#     databaseName='appthis_v2',
#     host='broadway-cluster-1.cluster-ro-cm6uyt5aeae8.us-west-2.rds.amazonaws.com',
#     user='root',
#     password='Mah14Mah1',
#     port=3306
# )
# connection_test = DatabaseConnection.test_connection(dbcon)
# if connection_test:
#     thecon = DatabaseConnection.create(dbcon)
#     print(thecon)
# else:
#     print('Failed connection test')

#
# result = dbcon.test_connection()
# dbcon.create(48)