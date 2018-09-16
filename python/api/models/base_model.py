from abc import ABC
from inspect import getfullargspec





class BaseModel(ABC):
    def __init__(self):
        self.table_name = self.__class__.__name__.lower()
        self.class_parameters = [a for a in getfullargspec(self.__class__.__init__).args if a != 'self']

    def __repr__(self):
        param_list = ', '.join(['{}={}'.format(k, v) for k, v in self.__dict__.items()])
        return '{}({})'.format(self.__class__.__name__, param_list)
