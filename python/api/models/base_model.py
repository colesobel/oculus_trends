from abc import ABC


class BaseModel(ABC):
    def __init__(self):
        pass

    def __repr__(self):
        param_list = ', '.join(['{}={}'.format(k, v) for k, v in self.__dict__.items()])
        return '{}({})'.format(self.__class__.__name__, param_list)