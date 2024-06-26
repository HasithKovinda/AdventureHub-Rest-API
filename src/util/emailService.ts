import path from "path";
import nodemailer, { Transporter } from "nodemailer";
import config from "config";
import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import { convert } from "html-to-text";
import { UserInput } from "../models/user.model";

export class EmailService {
  private host: string;
  private port?: number;
  private emailUserName?: string;
  private emailPassword?: string;
  private env: string;

  constructor(public user: UserInput, public url?: string) {
    this.env = process.env.NODE_ENV as string;
    this.host = config.get<string>("EMAIL_HOST");
    if (!(this.env === "production")) this.getEnv();
  }

  private getEnv() {
    this.port = config.get<number>("EMAIL_PORT");
    this.emailUserName = config.get<string>("EMAIL_USER_NAME");
    this.emailPassword = config.get<string>("EMAIL_PASSWORD");
  }

  private createNewTransport(): Transporter {
    if (this.env === "production") {
      const sendGridUserName = config.get<string>("SEND_GRID_USER_NAME");
      const sendGridPassword = config.get<string>("SEND_GRID_PASSWORD");
      return nodemailer.createTransport({
        service: "SendGrid",
        host: this.host,
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
    const templatesDir = path.resolve(process.cwd(), "build/templates");
    const baseTemplatePath = path.join(templatesDir, "base.ejs");
    const childrenTemplatePath = path.join(templatesDir, `${templateName}.ejs`);
    const html = await ejs.renderFile(baseTemplatePath, {
      body: await ejs.renderFile(childrenTemplatePath, data),
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
