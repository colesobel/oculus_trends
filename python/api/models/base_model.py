from abc import ABC
from inspect import getfullargspec
import inflection
from api.models import database


class BaseModel(ABC):
    def __init__(self):
        self.table_name = inflection.underscore(self.__class__.__name__)
        # self.class_parameters = [a for a in getfullargspec(self.__class__.__init__).args if a != 'self']

    def __repr__(self):
        param_list = ', '.join(['{}={}'.format(k, v) for k, v in self.__dict__.items()])
        return '{}({})'.format(self.__class__.__name__, param_list)

    @classmethod
    def get_class_parameters(cls):
        return [a for a in getfullargspec(cls.__init__).args if a != 'self']

    @classmethod
    def col_renames(cls):
        return [('id', 'id_')]

    @classmethod
    def to_class(cls, data: dict, renames):
        print(renames)
        for og, new in renames:
            if og in data:
                val = data[og]
                del data[og]
                data[new] = val

        class_params = cls.get_class_parameters()
        values = {}
        for k, v in data.items():
            if k in class_params:
                values[k] = v

        return cls(**values)

    @classmethod
    def find(cls, id_):
        sql = """
        SELECT *
        FROM {}
        WHERE id = %s
        """.format(cls.__name__.lower())

        result = database.sql_fetch_one(sql, (id_, ))

        return cls.to_class(result, cls.col_renames())







