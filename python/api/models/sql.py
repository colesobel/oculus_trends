from python.api.models import database as db


def single_insert(table, columns, values, timestamps=None, uuid=True):
    timestamps = timestamps or []
    uuid = ['uuid'] if uuid else []
    defaults = [{'type': 'timestamp', 'col_name': t, 'value': 'NOW()'} for t in timestamps] + \
               [{'type': 'uuid', 'col_name': 'uuid', 'value': 'UUID()'} for u in uuid]

    columns.extend([d['col_name'] for d in defaults])
    columns = ', '.join(columns)

    placeholders = ', '.join(['%s' for v in values])
    if defaults:
        placeholders += ', {}'.format(', '.join([d['value'] for d in defaults]))

    sql = """
    INSERT INTO {} ({})
    VALUES ({})
    """.format(table, columns, placeholders)
    args = values

    result = db.sql_insert(sql, args)
    return result



