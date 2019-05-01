import AccountModel from '../models/AccountModel';

// Action
export const setAccountAction = (
      createSession,
      dateRegistered,
      email,
      firstname,
      lastname,
      phoneNumber,
      token,
      avatarImageUrl
) => {
      // Testing goes here :)
      return {
            type: 'ACCOUNT_AUTHED',
            accountModel: new AccountModel(
                  createSession,
                  dateRegistered,
                  email,
                  firstname,
                  lastname,
                  phoneNumber,
                  token,
                  avatarImageUrl)
      }
};