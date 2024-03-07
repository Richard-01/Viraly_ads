import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.WALLET_URI || 'https://48txxo4gi1.execute-api.us-east-1.amazonaws.com/production',
  headers: {
    "Content-type": "application/json",
    "alias-name": `${process.env.WALLET_NAME || 'viraly'}`,
    "x-api-key": `${process.env.WALLET_KEY || 'sUvIoX5jb35u5cwaG55QV9VIcwOvqpj69CHf1Gbk'}`,
  },
});

const httpWalletClient = async (path, method, body = undefined) => {
  try {
    return httpClient(path, {
      method,
      data: body,
    });
  } catch (error) {
    console.log("Error al consultar las billeteras");
    console.log(error);
    return { status: 500 };
  }
};

export default httpWalletClient;
