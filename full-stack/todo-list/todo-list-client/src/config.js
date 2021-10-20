const configs = {
  dev: {
    api: {
      REGION: process.env.REACT_APP_dev_API_REGION,
      URL: process.env.REACT_APP_dev_API_URL,
      AUTH_TYPE: process.env.REACT_APP_dev_API_AUTH_TYPE,
      API_KEY: process.env.REACT_APP_dev_API_KEY,
    },
  },
};

if (!process.env.REACT_APP_STAGE) throw Error('Set REACT_APP_STAGE environmental variable');
if (!configs[process.env.REACT_APP_STAGE]) throw Error(`Config ${process.env.REACT_APP_STAGE} doesn't exist`);

const exported = {
  ...configs[process.env.REACT_APP_STAGE],
}

export default exported;
