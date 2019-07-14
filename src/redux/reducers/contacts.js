import DateUtils from '../../helpers/DateUtils'

// Reducer contacts
const contacts = (state = null, actionModel) => {
    switch (actionModel.type) {
        case 'SET_CONTACTS':
            return [
                ...actionModel.contacts.map(contact => {
                    return {
                        ...contact,
                        messages: [...contact.messages.map(m => {
                            return { ...m, humanTimestamp: DateUtils.dotnetTicksToSmartFormat(m.ticks) };
                        })]
                    };
                })
            ];

        case 'ADD_MESSAGE':
            return [
                ...state.map(contact => {
                    if (contact.contactPhoneNumber === actionModel.contact.contactPhoneNumber) {
                        return contact.messages ?
                            { ...contact, messages: [actionModel.message, ...contact.messages] } :
                            { ...contact, messages: [actionModel.message] }
                    } else {
                        return { ...contact }
                    }
                })
            ];

        case 'ADD_CONTACT':
            return [actionModel.contact, ...state];

        case 'SET_IS_FAVORITE':
            return state.map(contact => {
                if (contact.contactPhoneNumber === actionModel.contactPhoneNumber) {
                    contact.isFavorite = actionModel.isFavorite;
                }
                return contact;
            });

        case 'ACCOUNT_AUTHED':
            return actionModel.accountModel.contacts ? actionModel.accountModel.contacts : [];

        default:
            return state
    }
}

export default contacts