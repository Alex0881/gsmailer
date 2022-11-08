import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { PinoLogger } from 'nestjs-pino';
import { GsuiteSendEmailDto } from './dto/gsuiteSendEmail.dto';
import * as MailComposer from 'nodemailer/lib/mail-composer';
import { BASE64_ENCODING } from '../../common/constants/constants';
import { GsuiteSendEmailResponseDto } from './dto/gsuiteSendEmailResponse.dto';

@Injectable()
export class GsuiteService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GsuiteService.name);
  }

  async sendEmailV1(
    mailDto: GsuiteSendEmailDto,
  ): Promise<GsuiteSendEmailResponseDto> {
    const oAuth2Client = new google.auth.OAuth2();

    oAuth2Client.setCredentials({ access_token: mailDto.access_token });

    const mailComposerParameters = {
      to: mailDto.emailAddress,
      text: mailDto.letterText,
      html: mailDto.letterTextHTML,
      subject: mailDto.letterTopic,
      textEncoding: BASE64_ENCODING,
      attachments: [],
    };

    for (let i = 0; i < mailDto.letterAttachments.length; i++) {
      mailComposerParameters.attachments.push({
        filename: mailDto.letterAttachments[i].filename,
        content: mailDto.letterAttachments[i].content_base64,
        encoding: BASE64_ENCODING,
      });
    }

    let sendResult;
    try {
      const encodedMessage = await this.buildLetter(mailComposerParameters);
      sendResult = await this.sendMail(encodedMessage, oAuth2Client);

      return { message: sendResult };
    } catch (error) {
      this.logger.error(
        `${error} /// Topic - ${mailDto.letterTopic} /// Receiver - ${mailDto.emailAddress}`,
      );
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async buildLetter(mailComposerParameters): Promise<string> {
    return new Promise((resolve, reject) => {
      const mail = new MailComposer(mailComposerParameters);
      mail.compile().build((error, msg) => {
        if (error) {
          reject(`Error compiling email: ${error}`);
        } else {
          const encodedMessage = Buffer.from(msg)
            .toString(BASE64_ENCODING)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

          resolve(encodedMessage);
        }
      });
    });
  }

  async sendMail(encodedMessage, auth): Promise<string> {
    return new Promise((resolve, reject) => {
      const gmail = google.gmail({ version: 'v1', auth });
      gmail.users.messages.send(
        {
          userId: 'me',
          // @ts-ignore
          resource: {
            raw: encodedMessage,
          },
        },
        (err, result) => {
          if (err) {
            reject(
              `GSuite mail service - The Google API returned an error: ${err}`,
            );
          } else {
            resolve(
              `GSuite mail service - email was sent. Reply from server: ${JSON.stringify(
                result.data,
              )}.`,
            );
          }
        },
      );
    });
  }
}
