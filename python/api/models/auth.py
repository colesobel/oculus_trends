import random, string, json
from collections import namedtuple
import jwt
import bcrypt
import Crypto
import Crypto.Random
from cryptography.fernet import Fernet
from flask import request, Response, abort

from api.models import http_responses

AESEncryption = namedtuple('AESEncryption', ['cipher_text', 'key', 'iv'])
FernetEncryption = namedtuple('FernetEncryption', ['cipher_text', 'key'])

jwt_secret = 'cole'  # TODO MOVE THIS TO ENVIRONMENT VARIABLE
jwt_algo = 'HS256'  # TODO MOVE THIS TO ENVIRONMENT VARIABLE


def create_salt(size=16):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for x in range(size))


def _pad(s):
    bs = 16
    return s + (bs - len(s) % bs) * chr(bs - len(s) % bs)


def _unpad(s):
    return s[:-ord(s[len(s)-1:])]


def hash_pw(password):
    pw = str(password).encode('utf-8')
    return bcrypt.hashpw(pw, bcrypt.gensalt()).decode('utf-8')


def check_pw(password, hashed):
    password = bytes(str(password).encode('utf-8'))
    hashed = bytes(hashed.encode('utf-8'))
    result = bcrypt.checkpw(password, hashed)
    return result


def aes_encrypt(raw, key=None, iv=None):
    key = key or create_salt(16)
    iv = iv or create_salt(16)
    encrypter = Crypto.Cipher.AES.new(key, Crypto.Cipher.AES.MODE_CBC, iv)
    cipher_text = encrypter.encrypt(_pad(raw))
    return AESEncryption(cipher_text, key, iv)


def aes_decrypt(cipher_text, key, iv):
    decrypter = Crypto.Cipher.AES.new(key, Crypto.Cipher.AES.MODE_CBC, iv)
    return _unpad(decrypter.decrypt(cipher_text)).decode('utf-8')


def fernet_encrypt(raw, key=None):
    key = key or Fernet.generate_key()
    encrypter = Fernet(key)
    return FernetEncryption(encrypter.encrypt(bytes(raw.encode('utf-8'))).decode('utf-8'), key.decode('utf-8'))


def fernet_decrypt(cipher_text, key):
    decrypter = Fernet(bytes(key.encode('utf-8')))
    return decrypter.decrypt(bytes(cipher_text.encode('utf-8'))).decode('utf-8')


def decrypt_all(cipher_text, a_key, iv, f_key):
    return fernet_decrypt(aes_decrypt(cipher_text, a_key, iv), f_key)


def decode_jwt(token=None):
    token = token or request.headers.get('jwt')
    if token:
        try:
            decoded = jwt.decode(token, jwt_secret, algorithms=jwt_algo)
            return decoded
        except:
            return None


def encode_jwt(user_id, email, account_id, role_id):
    data = dict(
        user_id=user_id,
        email=email,
        account_id=account_id,
        role_id=role_id
    )
    encoded = jwt.encode(data, key=jwt_secret, algorithm=jwt_algo)
    return encoded


def authenticate(func):
    def wrapped(*args, **kwargs):
        auth_info = decode_jwt()
        print('authenticating!!')
        print(auth_info)
        if not auth_info:
            return http_responses.unauthenticated()
        else:
            return func(*args, **kwargs)

    wrapped.__name__ = func.__name__
    return wrapped


def authorize(*roles):
    def outer_wrap(func):
        def inner_wrap(*args, **kwargs):
            auth_info = decode_jwt()
            if not auth_info:
                return http_responses.unauthenticated()
            elif auth_info.get('role_id') not in roles:
                return http_responses.unauthorized()
            return func(*args, **kwargs)

        return inner_wrap

    return outer_wrap


def get_account_id_from_jwt(request):
    jwt = request.headers.get('jwt')
    decoded_jwt = decode_jwt(jwt)
    return decoded_jwt['account_id']


def get_field_from_jwt(request, field):
    jwt = request.headers.get('jwt')
    decoded_jwt = decode_jwt(jwt)
    return decoded_jwt[field]



# cipher_text, key = fernet_encrypt('hi there encrypt this')
#
# raw = fernet_decrypt(cipher_text, key)
# print(raw)




#
# secret = 'this is my super cool key that is hidden'
#
# things = aes_encrypt(secret)
# encrypted, key, iv = things.cipher_text, things.key, things.iv
# print(encrypted)
# raw = aes_decrypt(things.cipher_text, things.key, things.iv)
# print(raw)