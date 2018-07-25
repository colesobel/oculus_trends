import pymysql
import psycopg2 as ps
from psycopg2.extras import RealDictCursor

class DatabaseConnection:
    def __init__(self):
        pass

connection = ps.connect(dbname='appthis', host='batman.ctdsfkofgm52.us-west-2.redshift.amazonaws.com',
                        port=5439, user='root', password='Mah14Mah1')


sql = 'select * from rollup_offer_link_hour limit 100'


cur = connection.cursor()
dict_cursor = connection.cursor(cursor_factory=RealDictCursor)
dict_cursor.execute(sql)
result = dict_cursor.fetchall()
print('hi')
