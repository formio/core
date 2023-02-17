export type ProjectESignConfig = {
    enterpriseID: string;
    boxAppSettings: {
        clientID: string;
        clietnSecret: string;
        appAuth: {
            passphrase: string;
            privateKey: string;
            publiKeyID: string;
        };
    };
};
