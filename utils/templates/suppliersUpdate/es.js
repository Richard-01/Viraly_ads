export const esTemplate = ({ status, body = "", successfullUpdates, missingSuppliers }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta content="telephone=no" name="format-detection">
      <title>Viraly recovery password</title>
      <!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]-->
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
      <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <link href="https://stripo.email/" rel="stylesheet">
      <!--<![endif]-->
  </head>
  
  <body>
      <div class="es-wrapper-color">
          <!--[if gte mso 9]>
              <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                  <v:fill type="tile" color="#f8f9fd"></v:fill>
              </v:background>
          <![endif]-->
          <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                  <tr>
                      <td class="esd-email-paddings" valign="top">
                          <table cellpadding="0" cellspacing="0" class="es-content esd-header-popover" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center" esd-custom-block-id="147868">
                                          <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent;">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p10t es-p10b es-p15r es-p15l" align="left">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://viraly.s3.amazonaws.com/assets/logo_black.png" alt style="display: block;" width="210"></a></td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center" esd-custom-block-id="147870">
                                          <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p20t es-p20b es-p15r es-p15l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;" esd-custom-block-id="581310">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="center" class="esd-block-text es-m-txt-c">
                                                                                          <h2 style="color: #48687f; line-height: 100%; font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif; text-align: center; font-size: 27px;"><strong>Actualización de proveedores</strong></h2>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center" esd-custom-block-id="147885">
                                          <table bgcolor="#FFF" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p5t es-p15r es-p15l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;" esd-custom-block-id="581311">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="570" class="esd-container-frame" align="center" valign="top" esd-custom-block-id="581312">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="left" class="esd-block-text" bgcolor="#ffffff">
                                                                                          <p style="font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif; font-size: 16px; color: #000000;">Ha finalizado el proceso de actualización de proveedores. A continuación, se presenta el estado final de la actualización de los proveedores.</p>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center" esd-custom-block-id="147887">
                                          <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;" bgcolor="#ffffff">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p20t es-p20b" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="center" class="esd-block-text es-p20t es-p20b">
                                                                                          <p style="color: #48687f; font-size: 26px;"><strong>Estado: ${status}</strong></p>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center">
                                          <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p15t es-p15r es-p15l" align="left" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="570" class="esd-container-frame" align="center" valign="top">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="left" class="esd-block-text" esd-links-underline="underline" esd-links-color="#0b5394">
                                                                                          <p style="font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif; font-size: 16px; color: #000000;">${body}<br>Anuncios actualizados: ${successfullUpdates}<br>Anuncios que no se lograron actualizar: ${missingSuppliers}<br></p>
                                                                                      </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                      <td align="left" class="esd-block-text es-p20t">
                                                                                          <p style="font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif; font-size: 16px; color: #000000;">Thank you,<br>Viraly Team</p>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center">
                                          <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;" bgcolor="#ffffff">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure es-p5t es-p25b es-p15r es-p15l" align="left" esd-custom-block-id="147888" bgcolor="#ffffff" style="background-color: #ffffff;">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="570" class="esd-container-frame" align="left" esd-custom-block-id="147889">
                                                                          <table cellpadding="0" cellspacing="0" width="100%" style="border-radius: 8px; border-collapse: separate; background-color: #ffffff;" bgcolor="#ffffff">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="center" class="esd-block-spacer es-p20" style="font-size:0">
                                                                                          <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td style="border-bottom: 1px solid #cccccc; background: unset; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                      <td align="left" class="esd-block-text" esd-links-color="#0b5394" style="color: #131313;" esd-links-underline="underline">
                                                                                          <p>Cualquier anomalía, consultar con el equipo de desarrollo.</p>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <table cellpadding="0" cellspacing="0" class="es-content esd-footer-popover" align="center">
                              <tbody>
                                  <tr>
                                      <td class="esd-stripe" align="center">
                                          <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent;">
                                              <tbody>
                                                  <tr>
                                                      <td class="esd-structure" align="left">
                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                          <table cellpadding="0" cellspacing="0" width="100%">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td align="center" class="esd-block-text es-p20t es-p20b">
                                                                                          <h1 style="font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 14px; color: #cccccc;">© 2022&nbsp;Viraly. All rights reserved.</h1>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </body>
  
  </html>
  `
}