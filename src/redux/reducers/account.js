import AccountModel from '../models/AccountModel';

// Reducer account
const account = (state = null, actionModel) => {
  switch (actionModel.type) {
    case 'ACCOUNT_AUTHED':
      return AccountModel.getInstance(actionModel.accountModel);

    default:
  	  return state
  }
}

export default account