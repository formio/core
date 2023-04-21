export = Auth;
declare class Auth {
    token(payload: any, secret: any, expire?: number): Promise<any>;
    user(token: any, secret: any): Promise<any>;
}
