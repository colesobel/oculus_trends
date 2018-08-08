from python.api.models.base_model import BaseModel
from python.api.models.sql import single_insert


class Account(BaseModel):
    def __init__(self, name):
        super().__init__()
        self.name = name

        self.timestamp_defaults = ['created_on']
        self.columns = self.class_parameters
        self.values = [self.__dict__.get(p) for p in self.class_parameters]

    def create(self):
        result = single_insert(table=self.table_name,
                               columns=self.columns,
                               values=self.values,
                               timestamps=self.timestamp_defaults,
                               uuid=True)
        return result

