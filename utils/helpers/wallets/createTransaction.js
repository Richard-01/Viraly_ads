import httpWalletClient from "./httpWalletClient.js";
import httpWalletClientStaging from "./httpWalletClientStaging.js";

const createTransaction = async (transactionBody, stage = 'production') => {
  return (stage === 'production') 
  ? httpWalletClient("/do_transaction", "POST", transactionBody)
  : httpWalletClientStaging("/do_transaction", "POST", transactionBody);
};

export default createTransaction;
