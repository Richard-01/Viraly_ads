import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.WALLET_URI_STAGING || 'https://0xto05pru0.execute-api.us-east-1.amazonaws.com/staging',
  headers: {
    "Content-type": "application/json",
    "alias-name": `${process.env.WALLET_NAME || 'viraly'}`,
    "x-api-key": `${process.env.WALLET_KEY_STAGING || 'zjFfLHO5uW6xbW9EvpOIdaefR4kXEwr09E8lE0tb'}`,
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
