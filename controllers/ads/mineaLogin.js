const mineaLogin = async (browser, obtainToken = 'false') => {

  let page = null;
  try {
    let token = null;
    page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
    );

    await page.goto('https://app.minea.com/auth/login', {
      waitUntil: ['domcontentloaded'],
    });
    await page.waitForSelector('button[type=submit]');

    const email = process.env.MINEA_EMAIL || "asd@hotmail.com";
    const password = process.env.MINEA_PASSWORD || "12js7djdsd,32";

    await page.type('input[type=email]', email);
    await page.type('input[type=password]', password);
    
    await Promise.all([
      await page.click('button[type=submit]'),
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]).then(async() => {
      if(obtainToken === 'true') {
        token = await getApiToken(browser);
      }
    });

    return token;
  } catch( error ) {
    console.error("|::| Error al logearse en Minea");
    console.error(error);
    return null;
  } finally {
    await page.close();
  }
}

const getApiToken = async (browser) => {
  let page = null;
  try {
    page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
    );

    let token = null;

    page.on("requestfinished", async (request) => {
      const response = request.response();

      if (response.url().includes("_buildManifest.js")) {
        const partialUrl = response.url().split('/');
        token = partialUrl[partialUrl.length-2];
        
        if (!token) throw new Error('El token obtenido está vacío');
      }
    });

    await page.goto('https://app.minea.com/posts/6066746846688594?tab=ad_analysis', {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    return token;
  } catch(error) {
    console.error("|::| Error al obtener el token de Minea");
    console.error(error);
    return null;
  } finally {
    await page.close();
  }
}


export default mineaLogin;