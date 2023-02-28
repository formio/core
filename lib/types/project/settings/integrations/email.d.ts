export type ProjectEmailConfig = {
    smtp?: SmtpConfig;
    sendgrid?: SendGridConfig;
    mailgun?: MailgunConfig;
};
export type SmtpConfig = {
    auth: {
        user: string;
        pass: string;
    };
    host: string;
    port: string;
};
export type SendGridConfig = {
    auth: {
        api_key: string;
    };
};
export type MailgunConfig = {
    auth: {
        api_key: string;
        domain: string;
    };
};
export type CustomEmailConfig = {
    url: string;
    username: string;
    password: string;
};
