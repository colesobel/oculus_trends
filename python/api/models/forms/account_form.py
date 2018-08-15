from python.api.models import account, user, auth

# class AccountForm:
#     def __init__(self, accountName, firstName, lastName, email, password):
#         self.account_name = accountName
#         self.first_name = firstName
#         self.last_name = lastName
#         self.email = email
#         self.password = password


def post(accountName, firstName, lastName, email, password):
    """
    returns a dictionary with account data
    :param accountName:
    :param firstName:
    :param lastName:
    :param email:
    :param password:
    :return: account_data dict
    """
    acc = account.Account(accountName)
    account_id = acc.create()
    usr = user.User(account_id=account_id,
                    email=email,
                    password=password,
                    first_name=firstName,
                    last_name=lastName)

    user_id = usr.create()

    account_data = {
        'user_id': user_id,
        'account_id': account_id,
        'email': email
    }
    return account_data


