
def map_to_class(_dict, _class):
    try:
        instance = _class(**_dict)
        return instance
    except Exception as e:
        raise e
