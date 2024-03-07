import AWS from "aws-sdk";
import { esTemplate as adsTemplate } from "../templates/adsStatus/es.js";
import { esTemplate as supplierTemplate } from "../templates/suppliersUpdate/es.js";

const sendEmail = async ({subject, emailTemplate = 'ads'}, emailData, emails = ["daniel.salazar@shiipy.com"] ) => {
  try {
    AWS.config.update({region: 'us-east-1'});
    const ses = new AWS.SES();
    const template = (emailTemplate === 'suppliers')
    ? supplierTemplate(emailData)
    : adsTemplate(emailData);

    for await (const email of emails) {
      await ses.sendEmail({
        Destination: { ToAddresses: [email] },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: template,
            },
            Text: {
              Data: emailPlainText(emailData),
              Charset: "UTF-8",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: "Viraly Team <authenticate.viraly@gmail.com>",
      })
      .promise();
    }
    
  } catch (error) {
    console.log('|::| Error al enviar email');
    console.log(error);
  }
}

const emailPlainText = ({ status, body }) => {
  return `
    Sistema de anuncios\n
    Ha finalizado el proceso de extracción de anuncios. A continuación, se presenta el estado final del procesamiento de anuncios.: \n
    Estado: ${status}\n
    ${body}
  `;
};

export default sendEmail;

