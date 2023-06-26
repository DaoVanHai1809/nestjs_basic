export interface MailOptions {
  template?: string;
  preferedLanguage?: string;
  data?: Record<string, any>;
  noLayout?: boolean;
  senderType: string;
  mailTo?: { email: string; name: string };
}
