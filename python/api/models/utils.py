
def map_to_class(_dict, _class):
    try:
        instance = _class(**_dict)
        return instance
    except Exception as e:
        raise e


def get_fields_from_dict(_dict, *fields):
    return {f: _dict[f] for f in fields}


