from decimal import Decimal
from datetime import datetime
import json
import re
from flask import Request


def fields_from_request(request, *args):
    """

    yields a tuple of results
    """
    data = json.loads(request.data)
    results = []
    for a in args:
        results.append(data.get(a))

    return tuple(results)


def map_to_class(_dict, _class):
    try:
        instance = _class(**_dict)
        return instance
    except Exception as e:
        raise e


def get_fields_from_dict(_dict, *fields):
    """
    each "field" can be either an element of the dict, or a tuple, where elem[0] is the field from dict,
    elem[1] is the fuc to be applied to it, and any remaining elements will be applied as params to the function after
    elem[0]
    """
    result = {}
    for f in fields:
        if isinstance(f, tuple):
            k, func, *args = f
            result[k] = func(_dict[k], *args)
        else:
            result[f] = _dict[f]

    return result


def to_url_alias(name):
    name = name.lower()
    name = re.sub('[^a-z0-9\s]+', '', name)
    name = re.sub('\s', '_', name)
    return name


def serialize(o):
    if isinstance(o, Decimal):
        return round(float(o), 5)
    elif isinstance(o, datetime):
        return str(o)
    else:
        return o


def to_json(o):
    return json.dumps(o, default=serialize)