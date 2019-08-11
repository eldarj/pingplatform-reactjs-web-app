import DateUtils from '../../helpers/DateUtils'

// Helper functions
function formatMessageTimeLabels(messages) {
    return messages.map(m => { 
        return { ...m, humanTimestamp: DateUtils.dotnetTicksToSmartFormat(m.ticks) }
    })
}

// Reducer contacts
const contacts = (state = null, actionModel) => {
    switch (actionModel.type) {
        case 'SET_CONTACTS':
            return [
                ...actionModel.contacts.map(contact => {
                    return {
                        ...contact,
                        messages: formatMessageTimeLabels(contact.messages)
                    };
                })
            ];

        case 'UPDATE_CONTACT_MESSAGES_TIME_LABELS':
        	return [
                ...state.map(contact => {
                    if (contact.contactPhoneNumber === actionModel.contact.contactPhoneNumber && 
                        contact.messages) {
                        return { ...contact, messages: formatMessageTimeLabels(contact.messages) }
                    }

                    return { ...contact }
                })
            ];

        case 'ADD_MESSAGE':
            return [
                ...state.map(contact => {
                    if (contact.contactPhoneNumber === actionModel.contact.contactPhoneNumber) {
                        let messages = contact.messages ? [ actionModel.message, ...contact.messages ] : [ actionModel.message ];
                        return { ...contact, messages: formatMessageTimeLabels(messages) }
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