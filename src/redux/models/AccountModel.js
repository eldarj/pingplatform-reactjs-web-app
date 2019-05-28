class AccountModel {
    constructor(createSession,
        dateRegistered,
        email,
        firstname,
        lastname,
        phoneNumber,
        token,
        avatarImageUrl,
        coverImageUrl,
        contacts) {
            this.createSession = createSession;
            this.dateRegistered = dateRegistered;
            this.email = email;
            this.firstname = firstname;
            this.lastname = lastname;
            this.phoneNumber = phoneNumber;
            this.token = token;
            this.avatarImageUrl = avatarImageUrl;
            this.coverImageUrl = coverImageUrl;
            this.contacts = contacts ? [...contacts] : [];
    }

    static getInstance(obj) {
        return new AccountModel(
            obj.createSession,
            obj.dateRegistered,
            obj.email,
            obj.firstname,
            obj.lastname,
            obj.phoneNumber,
            obj.token,
            obj.avatarImageUrl,
            obj.coverImageUrl,
            obj.contacts
        );
    }
}

export default AccountModel;