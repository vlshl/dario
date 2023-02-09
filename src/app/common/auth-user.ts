export class AuthUser {
    userId: number;
    login: string;
    password: string;
    name: string;
    role: string;
    token: string;
    expTimeStr: string;

    constructor() {
        this.userId = 0;
        this.login = '';
        this.password = '';
        this.name = '';
        this.role = '';
        this.token = '';
        this.expTimeStr = '';
    }
}
