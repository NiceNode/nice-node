/* eslint-disable @typescript-eslint/no-explicit-any */
export const callJsonRpc = async (method: string, params: any[]) => {
  const resp = await fetch('http://localhost:9545', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    mode: 'no-cors',
    body: JSON.stringify({
      id: 'id',
      jsonrpc: '2.0',
      method,
      params,
    }),
  });
  return resp.json();
};
