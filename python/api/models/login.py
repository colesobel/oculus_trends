from api.models import auth, user


def login_user(email, password):
    try:
        usr = user.User.find_by_email(email)
        authenticated = auth.check_pw(password, usr['password'])
        if authenticated:
            return usr
    except:
        return False








