from python.api.models import auth, user


def login_user(email, password):
    try:
        usr = user.User.find_by_email(email)
        print(usr)
        authenticated = auth.check_pw(password, usr['password'])
        print('hello')
        print(authenticated)
        if authenticated:
            return usr
    except:
        return False



