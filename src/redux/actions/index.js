import AccountModel from '../models/AccountModel';

// Action set contacts
export const setContacts = (contactsArray) => {
      return {
            type: 'SET_CONTACTS', 
            contacts: contactsArray
      }
}

export const addMessage = (contact, newMessage) => {
      return {
            type: 'ADD_MESSAGE',
            contact: contact,
            message: newMessage
      }
}

export const addContact = (contact) => {
      return {
            type: 'ADD_CONTACT',
            contact: contact
      }
}

export const setContactIsFavorite = (contactPhoneNumber, isFavorite) => {
      return {
            type: 'SET_IS_FAVORITE',
            contactPhoneNumber: contactPhoneNumber,
            isFavorite: isFavorite
      }
}

export const updateContactMessageTimeLabels = (contact) => {
      return {
            type: 'UPDATE_CONTACT_MESSAGES_TIME_LABELS',
            contact: contact
      }
}

// Action set account
// TODO Change this to accept objects (or models - should we do the mapping somewhere else?)
export const setAccountAction = (
      createSession,
      dateRegistered,
      email,
      firstname,
      lastname,
      phoneNumber,
      token,
      avatarImageUrl,
      coverImageUrl,
      contacts
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
                  avatarImageUrl,
                  coverImageUrl,
                  contacts)
      }
};