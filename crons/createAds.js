import puppeteer from "puppeteer";
import getAdsModel from "../database/models/getAdsModel.js";
import mineaLogin from "../controllers/ads/mineaLogin.js";
import mysqlDriver from "../database/mysqlDriver.js";
import sendEmail from "../utils/helpers/sendEmail.js";

const createAds = async (language, obtainToken = "false") => {

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
    defaultViewport: null,
  });
  let conn = null;
  try {
    conn = await mysqlDriver.awaitGetConnection();
    const Ads = await getAdsModel();

    const searchTermsQuery =
      "SELECT term, language FROM search_term WHERE language = ?";
    const searchTerms = await mysqlDriver.awaitQuery(searchTermsQuery, [
      language,
    ]);

    const token = await mineaLogin(browser, obtainToken);

    if (token) {
      const adsPlatformQuery =
        "UPDATE ads_platform SET platform = 'Minea', token = ?";
      await mysqlDriver.awaitQuery(adsPlatformQuery, [token]);
    }
    await conn.release();
    conn = null;

    const page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
    );

    await page.goto("https://app.minea.com/posts", {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });
    optimizeResources(page);

    // Change language
    await page.waitForSelector("#headlessui-popover-button-\\:re\\:");
    await page.click("#headlessui-popover-button-\\:re\\:");
    await page.click(`input[value="${language}"]`);
    await page.waitForTimeout(500);
    const apiResponseUrl = "https://y5ec7qy3bzbkxm6udp4u3o3lee.appsync-api.eu-west-1.amazonaws.com/graphql";

    // Capture and save ad data obtained from HTTP responses
    page.on("requestfinished", async (request) => {
      const response = request.response();

      if (response.url().includes(apiResponseUrl)) {
        response.json().then(async (productInfo) => {
          if (productInfo["data"]["searchAds"]) {
            const items = productInfo["data"]["searchAds"]["items"];
            saveAds(Ads, {
              ads: items,
              language,
            });
          }
        });
      }
    });
    await page.waitForResponse(apiResponseUrl);
    await page.waitForTimeout(200);

    // Search ads by terms
    for await (const { term } of searchTerms) {
      await page.$eval(
        'input[data-test="searchBar"]',
        (searchInput) => (searchInput.value = "")
      );
      await page.type('input[data-test="searchBar"]', term);
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      await page.waitForResponse(apiResponseUrl);
      await page.waitForTimeout(600);
    }
    
  } catch (error) {
    console.log("Error al crear los anuncios:");
    console.log(error);

    await sendEmail(
      {
        subject: `[${language.toUpperCase()}] Obtención de anuncios - Error al obtener los ads`,
      },
      {
        body: JSON.stringify(error),
        status: "Error",
      },
      ["daniel.salazar@shiipy.com", "hansrondon1998@gmail.com", "manager.viraly@gmail.com"]
    );
    
  } finally {
    if (conn) await conn.release();
    if (browser) await browser.close();
  }
};


const optimizeResources = async (page) => {
  await page.setRequestInterception(true);
  const uselessResourceTypes = ["image", "other", "media", "font"];

  page.on("request", (request) => {
    const resourceType = request.resourceType();

    uselessResourceTypes.includes(resourceType)
      ? request.abort()
      : request.continue();
  });
};

const saveAds = async (adsModel, { ads, language }) => {
  for await (const { id } of ads) {
    await adsModel
      .findOneAndUpdate(
        { id: id },
        {
          id,
          language,
        },
        { upsert: true }
      )
      .exec();
  }
};

export default createAds;
