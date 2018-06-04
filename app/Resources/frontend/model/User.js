export default class User {

    constructor(hydra) {
        this.id    = hydra['id'];
        this.name  = hydra['username'];
        this.roles = hydra['roles'];
    }

    isAdmin() {
        return this.roles.includes('ROLE_ADMIN');
    }

}