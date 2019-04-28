class AccountModel {
    constructor(createSession,
        dateRegistered,
        email,
        firstname,
        lastname,
        phoneNumber,
        token) {
            this.createSession = createSession;
            this.dateRegistered = dateRegistered;
            this.email = email;
            this.firstname = firstname;
            this.lastname = lastname;
            this.phoneNumber = phoneNumber;
            this.token = token;
    }

    static getInstance(obj) {
        return new AccountModel(
            obj.createSession,
            obj.dateRegistered,
            obj.email,
            obj.firstname,
            obj.lastname,
            obj.phoneNumber,
            obj.token
        );
    }
}

export default AccountModel;