const mineaGetToken = async (browser) => {
  try {
    const page = await browser.newPage();
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
    return null;
  } finally {
    await page.close();
  }
}

export default mineaGetToken;