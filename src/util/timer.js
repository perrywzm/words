export const sleep = interval => {
  return new Promise(resolve => setTimeout(resolve, interval));
};
