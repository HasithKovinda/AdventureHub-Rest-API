import nodemailer from "nodemailer";
import config from "config";
import Mail from "nodemailer/lib/mailer";

export class EmailService {
  private host: string;
  private port: number;
  private emailUserName: string;
  private emailPassword: string;

  constructor() {
    this.host = config.get<string>("email_host");
    this.port = config.get<number>("email_port");
    this.emailUserName = config.get<string>("email_user_name");
    this.emailPassword = config.get<string>("email_password");
  }

  async sendEmail(mailOptions: Mail.Options) {
    mailOptions.from = mailOptions.from
      ? mailOptions.from
      : "Hasith Kovinda <adventure@inc.io>";
    const transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.emailUserName,
        pass: this.emailPassword,
      },
    });
    await transporter.sendMail(mailOptions);
  }
}
