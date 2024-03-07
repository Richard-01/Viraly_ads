const getSupplierData = async (page, isUpdate = false) => {
  try {
    const supplierData = {
      url: page.url(),
      isCertified: true,
    };

    await page.waitForTimeout(550);
    const supplierIsVerified = await page.$(".join-year > .value") || null;
    let nameSelector = ".company-head > .company-item > a"
    let yearsSelector = ".company-year";

    if (supplierIsVerified) {
      nameSelector = ".company-name-lite-vb"
      yearsSelector = ".join-year > .value";
    }

    const companyAttributes = (supplierIsVerified)
    ? await getVerifiedCompanyAttributes(page)
    : await getCompanyAttributes(page);

    const responseTime = await page.$$eval(
      ".lead-list > table > tbody",
      (table) => {
        return table.map((timeInfo) => {
          const getTimeType = /\(([^()]*)\)/gm;
          const timeRows = timeInfo.children[1];
          const timeType = getTimeType.exec(
            timeRows.children[0].textContent
          )[1];
          const timeValue = Number(timeRows.children[1].textContent);
          return `${timeValue} ${timeType}`;
        });
      }
    );
    
    const { moneyTransactions, numberTransactions, deliveriesPercentage } =
      getDeliveryInfo(companyAttributes);

    if (!isUpdate) {
      page
        .$eval(".ta-icon", (icon) => icon.innerHTML)
        .catch(() => {
          supplierData["isCertified"] = false;
        });
    }
    
    supplierData["name"] = await page.$eval(nameSelector,
    (name) => name.textContent);

    supplierData["years"] = await page.$eval(yearsSelector, 
      (years) => Number(years.textContent));

    supplierData["moneyTransactions"] = moneyTransactions;
    supplierData["price"] = await page.$eval(
      ".price",
      (price) => price.textContent.replace(/(?<=\d)\$/g, " - $")
    );
    supplierData["numberTransactions"] = numberTransactions;
    supplierData["deliveriesPercentage"] = deliveriesPercentage;
    supplierData["responseTime"] = responseTime[0];

    return {
      error: false,
      supplierData,
    };
  } catch (error) {
    return {
      error: true,
      errorMessage: error,
      url: page.url(),
    };
  }
};

const getCompanyAttributes = async(page) => {
  return page.$$eval(".company-body > .company-info",
    (attributes) => {
      return attributes.map((attribute) => {
        const attributeTitle =
          attribute.querySelector(".info-title").textContent;
        const attributeValue =
          attribute.querySelector(".info-intro").textContent;
        return { attributeTitle, attributeValue };
      });
    }
  );
} 

const getVerifiedCompanyAttributes = async(page) => {

  const getAttributeText = (attributes) => {
    return attributes.map((attribute) => {
      return attribute.textContent;
    });
  }

  const titles = await page.$$eval(".attr-title", getAttributeText);
  const values = await page.$$eval(".attr-content", getAttributeText);

  return titles.map((title, index) => {
    return {
      attributeTitle: title,
      attributeValue: values[index],
    };
  });
  
} 

const getDeliveryInfo = (companyAttributes) => {
  const deliveryInfo = {
    moneyTransactions: null,
    deliveriesPercentage: null,
    numberTransactions: null,
  };
  const regexOnlyNumbers = /\D/g;

  companyAttributes.forEach((attribute) => {
    if (attribute["attributeTitle"].includes("Transactions")) {
      deliveryInfo["numberTransactions"] = Number(
        attribute["attributeTitle"].split(" ")[0]
      ) || null;
      deliveryInfo["moneyTransactions"] = Number(
        attribute["attributeValue"].replace(regexOnlyNumbers, "")
      );
    } else if (attribute["attributeTitle"] == "On-time delivery rate") {
      deliveryInfo["deliveriesPercentage"] = attribute["attributeValue"];
    }
  });

  return deliveryInfo;
};

export default getSupplierData;