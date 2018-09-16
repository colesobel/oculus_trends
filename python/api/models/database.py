import pymysql

# TODO MAKE ALL THESE ENVIRONMENT VARIABLES
HOST = 'localhost'
USER = 'root'
PASSWORD = ''
DATABASE = 'oculus_trends'
# TODO MAKE ALL THESE ENVIRONMENT VARIABLES


def create_sql_connection(database=DATABASE, local_infile=False):
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


def sql_insert(query, args):
    connection = create_sql_connection()
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


def sql_fetch_all(query, args, database=DATABASE):
    connection = create_sql_connection(database=database)
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
    connection = create_sql_connection(database=database)
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

