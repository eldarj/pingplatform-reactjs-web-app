const account = (state = [], actionModel) => {
  switch (actionModel.type) {
    case 'ACCOUNT_AUTHED':
      return {
        id: actionModel.id,
        phoneNumber: actionModel.phoneNumber
      }
    default:
      return state
  }
}

export default account