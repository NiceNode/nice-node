import { JSONRPCClient } from 'json-rpc-2.0';

// JSONRPCClient needs to know how to send a JSON-RPC request.
// Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.
const client: JSONRPCClient = new JSONRPCClient((jsonRPCRequest: any) =>
  fetch('http://localhost:9545', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    // mode: 'no-cors',
    body: JSON.stringify(jsonRPCRequest),
  }).then((response) => {
    if (response.status === 200) {
      // Use client.receive when you received a JSON-RPC response.
      // eslint-disable-next-line promise/no-nesting
      return response
        .json()
        .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
    }
    if (jsonRPCRequest.id !== undefined) {
      return new Error(response.statusText);
    }
    return new Error('Response not ok');
  })
);

// Use client.request to make a JSON-RPC request call.
// The function returns a promise of the result.
// client
//   .request('echo', { text: 'Hello, World!' })
//   .then((result) => console.log(result));

// Use client.notify to make a JSON-RPC notification call.
// By definition, JSON-RPC notification does not respond.
client.notify('log', { message: 'Hello, World!' });

export default client;

export const callJsonRpc = async (method, params) => {
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
