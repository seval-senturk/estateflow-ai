export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  replyTo?: string;
}

export type EmailSender = (options: SendEmailOptions) => Promise<void>;
