import json
import inflection
from api.models import base_model, utils, database, database_connection


class Chart(base_model.BaseModel):
    def __init__(
        self,
        id_, 
        uuid, 
        name, 
        chart_type_id, 
        dashboard_id,
        x, 
        y, 
        height, 
        width, 
        query,
        x_axis,
        y_axis,
        options, 
        dbc_id
    ):
        super().__init__()
        self.id_ = id_
        self.uuid = uuid, 
        self.name = name
        self.chart_type_id = chart_type_id
        self.dashboard_id = dashboard_id
        self.x = x
        self.y = y
        self.height = height 
        self.width = width
        self.query = query
        self.x_axis = x_axis
        self.y_axis = y_axis
        self.options = options
        self.dbc_id = dbc_id

    def json(self):
        return {
            'id': self.id_,
            'name': self.name
        }

    def json_full(self):
        return {
            'id': self.id_,
            'uuid': self.uuid,
            'name': self.name,
            'chartTypeId': self.chart_type_id,
            'dashboardId': self.dashboard_id,
            'x': self.x,
            'y': self.y,
            'height': self.height,
            'width': self.width,
            'query': self.query,
            'xAxis': self.x_axis,
            'yAxis': self.y_axis,
            'options': self.options,
            'dbcId': self.dbc_id
        }

    def run_query(self, refresh=False):
        if not refresh:  # pull from cache
            result = database.redis_get(self.id_)
            if result:
                return json.loads(result)

        dbc = database_connection.DatabaseConnection.find(self.dbc_id)
        result = dbc.run_query(self.query)
        database.redis_set(self.id_, utils.to_json(result))

        return result

    @classmethod
    def create(cls, account_id, data):
        """
        :param data: json string
        :return: Chart
        """
        # TODO verify accound_id contains dashboard_id
        data = json.loads(data)
        insert = dict(
            name=data.get('name'),  # required / str
            chart_type_id=data.get('chartTypeId'),  # required / int
            dashboard_id=data.get('dashboardId'),  # required / int
            x=data.get('x'),  # optional / 3pt float
            y=data.get('y'),  # optional / 3pt float
            height=data.get('height'),  # optional / int
            width=data.get('width'),  # optional / int
            query=data.get('query'),  # required / str
            x_axis=data.get('xAxis'),  # optional / str
            y_axis=data.get('yAxis'),  # optional / str
            options=data.get('options'),  # optional / json str
            dbc_id=data.get('dbcId')  # required / int
        )
        sql = """
        INSERT INTO chart (uuid, name, chart_type_id, dashboard_id, x, y, height, width, query, x_axis, y_axis, options, dbc_id, created_on)
        VALUES (UUID(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        id_ = database.sql_insert(
            sql, 
            (
                insert['name'],
                insert['chart_type_id'],
                insert['dashboard_id'],
                insert['x'],
                insert['y'],
                insert['height'],
                insert['width'],
                insert['query'],
                insert['x_axis'],
                insert['y_axis'],
                insert['options'],
                insert['dbc_id']
            )
        )
        return cls.find(id_)

    def update(self, params):
        valid_params = {inflection.underscore(k): v for k, v in params.items()
            if inflection.underscore(k) in self.get_class_parameters()}

        if not valid_params:
            return

        updates = ', '.join(['{} = %s'.format(k) for k in valid_params])
        sql = """
        UPDATE chart
        SET {}
        WHERE id = %s
        """.format(updates)
        args = tuple([v for k, v in valid_params.items()] + [self.id_])
        database.sql_execute(sql, args)

        return

