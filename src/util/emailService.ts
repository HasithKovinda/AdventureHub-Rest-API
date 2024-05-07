import nodemailer, { Transporter } from "nodemailer";
import config from "config";
import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import { convert } from "html-to-text";
import { UserInput } from "../models/user.model";

export class EmailService {
  private host: string;
  private port: number;
  private emailUserName: string;
  private emailPassword: string;
  private env: string;

  constructor(public user: UserInput, public url?: string) {
    this.host = config.get<string>("email_host");
    this.port = config.get<number>("email_port");
    this.emailUserName = config.get<string>("email_user_name");
    this.emailPassword = config.get<string>("email_password");
    this.env = process.env.NODE_ENV as string;
  }

  private createNewTransport(): Transporter {
    if (this.env === "production") {
      const sendGridUserName = config.get<string>("SEND_GRID_USER_NAME");
      const sendGridPassword = config.get<string>("SEND_GRID_PASSWORD");
      const sendGridHost = config.get<string>("SEND_GRID_HOST");
      return nodemailer.createTransport({
        service: "SendGrid",
        host: sendGridHost,
        auth: {
          user: sendGridUserName,
          pass: sendGridPassword,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: this.host,
        port: this.port,
        auth: {
          user: this.emailUserName,
          pass: this.emailPassword,
        },
      });
    }
  }

  async send(templateName: string, subject: string, data: object) {
    const html = await ejs.renderFile(`${__dirname}/../templates/base.ejs`, {
      body: await ejs.renderFile(
        `${__dirname}/../templates/${templateName}.ejs`,
        data
      ),
    });
    const from = (
      this.env === "production" ? config.get("FROM") : "Adventure@hub.io"
    ) as string;
    const mailOptions: Mail.Options = {
      to: this.user.email,
      from,
      subject,
      html,
      text: convert(html),
    };

    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to AdventureHub family 💞", {
      name: this.user.name,
    });
  }
  async sendPasswordRestToken() {
    await this.send("passwordReset", "Password Rest Token", {
      name: this.user.name,
      url: this.url,
    });
  }
}
