import random, string, json
from collections import namedtuple
import jwt
import bcrypt
import Crypto
import Crypto.Random
from flask import request, Response

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
    return bcrypt.hashpw(pw, bcrypt.gensalt(rounds=12))


def check_pw(password, hashed):
    pw = str(password).encode('utf-8')
    return bcrypt.checkpw(pw, hashed)


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
    token = token or get_jwt()
    if token:
        try:
            decoded = jwt.decode(token, jwt_secret, algorithms=jwt_algo)
            print(decoded)
            return decoded
        except:
            return None


def create_jwt(data):
    encoded = jwt.encode(data, key=jwt_secret, algorithm=jwt_algo)
    print(encoded)
    return encoded


def get_jwt():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        if token:
            return token
    except:
        return None


def authenticate(func):
    def wrapped(*args, **kwargs):
        auth_info = decode_jwt()
        if not auth_info:
            return Response(json.dumps({'error': 'Unauthenticated'}), status=403, mimetype='application/json')
        else:
            return func(*args, **kwargs)

    return wrapped



# secret = 'this is my super cool key that is hidden'
#
# things = aes_encrypt(secret)
# encrypted, key, iv = things.cipher_text, things.key, things.iv
# print(encrypted)
# raw = aes_decrypt(things.cipher_text, things.key, things.iv)
# print(raw)



encoded = create_jwt({'name': 'cole', 'location': 'sd'})
decoded = decode_jwt(encoded)
