import redis
import pymysql

# TODO MAKE ALL THESE ENVIRONMENT VARIABLES
REDIS_HOST = 'localhost'
REDIS_PORT = 6379

HOST = 'localhost'
USER = 'root'
PASSWORD = ''
DATABASE = 'oculus_trends'
# TODO MAKE ALL THESE ENVIRONMENT VARIABLES


def connect_to_redis():
    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=0
    )
    return r


def redis_get(key):
    try:
        r = connect_to_redis()
        result = r.get(key)
        return result.decode('utf-8') if result else None
    except Exception as e:
        print(e)
        return None


def redis_set(key, val):
    try:
        r = connect_to_redis()
        r.set(key, val)
        return True
    except Exception as e:
        print(e)
        return False




def create_mysql_connection(database=DATABASE, local_infile=False):
    return pymysql.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=database,
        use_unicode=True,
        charset="utf8",
        local_infile=local_infile,
        cursorclass=pymysql.cursors.DictCursor
    )


def create_client_mysql_connection(database_connection):
    return pymysql.connect(
        host=database_connection.host,
        user=database_connection.user,
        password=database_connection.password,
        database=database_connection.database_name,
        use_unicode=True,
        charset="utf8",
        cursorclass=pymysql.cursors.DictCursor
    )


def sql_insert(query, args):
    connection = create_mysql_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, args)
            insert_id = cursor.lastrowid
            connection.commit()
    except Exception as e:
        raise e
    else:
        return insert_id
    finally:
        connection.close()


def sql_execute(query, args):
    rows_affected = 0
    connection = create_mysql_connection()
    try:
        with connection.cursor() as cursor:
            rows_affected = cursor.execute(query, args)
            if rows_affected:
                connection.commit()
    except Exception as e:
        print(e)
    finally:
        connection.close()
        return rows_affected


def sql_fetch_all(query, args, database=DATABASE):
    connection = create_mysql_connection(database=database)
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, args)
            result = cursor.fetchall()
    except Exception as e:
        raise e
    else:
        return result
    finally:
        connection.close()


def sql_fetch_one(query, args, database=DATABASE):
    connection = create_mysql_connection(database=database)
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, args)
            result = cursor.fetchone()
    except Exception as e:
        raise e
    else:
        return result
    finally:
        connection.close()


def client_mysql_fetch_all(connection, query, args):
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, args)
            result = cursor.fetchall()
    except Exception as e:
        raise e
    else:
        return result
    finally:
        connection.close()
