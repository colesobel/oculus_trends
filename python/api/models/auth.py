import random, string
from collections import namedtuple
import bcrypt
import Crypto
import Crypto.Random

Encryption = namedtuple('Encryption', ['cipher_text', 'key', 'iv'])


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


secret = 'this is my super cool key that is hidden'

things = aes_encrypt(secret)
encrypted, key, iv = things.cipher_text, things.key, things.iv
print(encrypted)
raw = aes_decrypt(things.cipher_text, things.key, things.iv)
print(raw)
