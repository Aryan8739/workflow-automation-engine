import axios from 'axios';

async function httpHandler(config, input) {
  // config shape: { method, url, headers, body }
  const { method = 'GET', url, headers = {}, body = {} } = config;
  
  if (!url) {
    throw new Error('HTTP node requires a URL in config.');
  }

  const response = await axios({
    method,
    url,
    headers,
    data: body
  });

  return {
    status: response.status,
    data: response.data
  };
}

export default httpHandler;
