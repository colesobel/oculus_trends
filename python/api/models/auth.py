import random, string, json
from collections import namedtuple
import jwt
import bcrypt
import Crypto
import Crypto.Random
from flask import request, Response, abort

from api.models import http_responses

Encryption = namedtuple('Encryption', ['cipher_text', 'key', 'iv'])

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
    print(result)
    return result


def aes_encrypt(raw):
    key = create_salt(16)
    iv = create_salt(16)
    encrypter = Crypto.Cipher.AES.new(key, Crypto.Cipher.AES.MODE_CBC, iv)
    cipher_text = encrypter.encrypt(_pad(raw))
    return Encryption(cipher_text, key, iv)


def aes_decrypt(cipher_text, key, iv):
    decrypter = Crypto.Cipher.AES.new(key, Crypto.Cipher.AES.MODE_CBC, iv)
    return _unpad(decrypter.decrypt(cipher_text)).decode('utf-8')


def decode_jwt(token=None):
    token = token or request.headers.get('jwt')
    if token:
        try:
            decoded = jwt.decode(token, jwt_secret, algorithms=jwt_algo)
            return decoded
        except:
            return None


def encode_jwt(data):
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

    return wrapped


def get_account_id_from_jwt(request):
    jwt = request.headers.get('jwt')
    decoded_jwt = decode_jwt(jwt)
    return decoded_jwt['account_id']



# secret = 'this is my super cool key that is hidden'
#
# things = aes_encrypt(secret)
# encrypted, key, iv = things.cipher_text, things.key, things.iv
# print(encrypted)
# raw = aes_decrypt(things.cipher_text, things.key, things.iv)
# print(raw)
