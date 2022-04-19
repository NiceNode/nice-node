export const hexToDecimal = (hex: string) => parseInt(hex, 16);

const EXECUTION_CLIENTS = ['Geth', 'Nethermind', 'Besu'];

export const detectExecutionClient = (
  clientName: string | undefined,
  version: boolean | undefined
) => {
  if (clientName === undefined) {
    return undefined;
  }
  let formattedClientName = EXECUTION_CLIENTS.find((currEc) => {
    if (clientName.toLowerCase().includes(currEc.toLowerCase())) {
      return currEc;
    }
    return false;
  });
  if (formattedClientName) {
    if (version) {
      // parse version
      const matchedVersion = clientName.match(/v\d+.\d+.\d+/i);
      if (matchedVersion) {
        formattedClientName = `${formattedClientName} ${matchedVersion}`;
      }
    }
    return formattedClientName;
  }
  return clientName;
};
