
export const toFloat = (amount, decimals = 2) => {
  amount = amount.toString();
  amount = amount.slice(0, (amount.indexOf(".")) + decimals + 1); 
  return Number(amount);   
}