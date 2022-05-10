import { useCallback, useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

import { NodeConfig } from '../../main/state/nodeConfig';
import electron from '../electronGlobal';
import { NodeStatus } from '../../common/node';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectNodeStatus, updateNodeConfig } from '../state/node';
import metamaskLogo from '../../../assets/metamaskLogo.svg';

const METAMASK_CHROME_EXTENSION_ID =
  'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn';
const METAMASK_FIREFOX_EXTENSION_ID =
  'moz-extension://e9845626-1402-4ea2-9534-f54a65cf958f';

const NODE = 'geth';

const NodeConfiguration = () => {
  const [sNodeConfig, setNodeConfig] = useState<NodeConfig>();
  const [sNodeConfigRaw, setNodeConfigRaw] = useState<string>();
  const [sMetaMaskEnabled, setMetaMaskEnabled] = useState<boolean>();
  const [sLightModeEnabled, setLightModeEnabled] = useState<boolean>();
  const [sParseError, setParseError] = useState<string>();
  const sNodeStatus = useAppSelector(selectNodeStatus);
  const dispatch = useAppDispatch();

  const getNodeConfig = useCallback(async () => {
    const nodeConfig = await electron.getNodeConfig(NODE);
    dispatch(updateNodeConfig(nodeConfig));
    setNodeConfig(nodeConfig);
    const strRepresentation = nodeConfig.useDirectInput
      ? nodeConfig.directInputConfig
      : nodeConfig.asCliInput;
    setNodeConfigRaw(JSON.stringify(strRepresentation, null, 2));
  }, [dispatch]);

  useEffect(() => {
    if (!sNodeConfig) {
      return;
    }
    if (Array.isArray(sNodeConfig.httpAllowedDomains)) {
      if (
        sNodeConfig.httpAllowedDomains.includes(METAMASK_CHROME_EXTENSION_ID) ||
        sNodeConfig.httpAllowedDomains.includes(METAMASK_FIREFOX_EXTENSION_ID)
      ) {
        setMetaMaskEnabled(true);
        return;
      }
    }
    setMetaMaskEnabled(false);

    setLightModeEnabled(sNodeConfig.syncMode === 'light');
  }, [sNodeConfig]);

  const setToDefaultNodeConfig = async () => {
    await electron.setToDefaultNodeConfig(NODE);
    await getNodeConfig();
  };

  const changeNodeConfig = async (newConfig: NodeConfig) => {
    await electron.changeNodeConfig(NODE, newConfig);
    await getNodeConfig();
  };

  const toggleMetamaskConnections = async () => {
    const currAllowedDomains = sNodeConfig?.httpAllowedDomains;

    // add metamask extension IDs to allowed http origins
    let newAllowedDomains: string[] = [];
    if (Array.isArray(currAllowedDomains)) {
      newAllowedDomains = currAllowedDomains;
    }
    if (sMetaMaskEnabled) {
      // disable metamask
      newAllowedDomains = newAllowedDomains.filter((domain) => {
        return (
          domain !== METAMASK_CHROME_EXTENSION_ID &&
          domain !== METAMASK_FIREFOX_EXTENSION_ID
        );
      });
    } else {
      // enable metamask
      if (!newAllowedDomains.includes(METAMASK_CHROME_EXTENSION_ID)) {
        newAllowedDomains = newAllowedDomains.concat(
          METAMASK_CHROME_EXTENSION_ID
        );
      }
      if (!newAllowedDomains.includes(METAMASK_FIREFOX_EXTENSION_ID)) {
        newAllowedDomains = newAllowedDomains.concat(
          METAMASK_FIREFOX_EXTENSION_ID
        );
      }
    }
    changeNodeConfig({
      http: true,
      httpAllowedDomains: newAllowedDomains,
    });
  };

  const toggleLightClient = async () => {
    changeNodeConfig({
      syncMode: sLightModeEnabled ? 'snap' : 'light',
    });
  };

  useEffect(() => {
    getNodeConfig();
  }, [getNodeConfig]);

  const onChangeRawInput = (newRawInput: string) => {
    setNodeConfigRaw(newRawInput);

    if (newRawInput) {
      try {
        const nodeConfigInput = JSON.parse(newRawInput);
        if (Array.isArray(nodeConfigInput)) {
          const isAllStrings = nodeConfigInput.every(
            (i) => typeof i === 'string'
          );
          if (!isAllStrings) {
            setParseError(
              'The config must be an array of strings. An element is not a string.'
            );
            return;
          }
          electron.setDirectInputNodeConfig(NODE, nodeConfigInput);
          setParseError(undefined);
        } else {
          setParseError('Input is not an array.');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setParseError(err.message);
      }
    } else {
      setParseError(
        'Input an array of strings or just [] if no input desired.'
      );
    }
  };

  const isConfigDisabled = !(
    sNodeStatus === NodeStatus.readyToStart ||
    sNodeStatus === NodeStatus.stopped
  );

  return (
    <>
      <h2>Node</h2>
      {isConfigDisabled && (
        <h5>The node must be stopped to make configuration changes.</h5>
      )}
      {sNodeConfig?.useDirectInput && (
        <h5>Detected advanced usage from direct text input</h5>
      )}
      <h3>Sync mode</h3>
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={toggleLightClient}
          disabled={isConfigDisabled}
          style={{ marginLeft: 10 }}
        >
          <span>
            {sLightModeEnabled ? 'Run full node mode' : 'Run light client mode'}
          </span>
        </button>
        <a
          target="_blank"
          href="https://geth.ethereum.org/docs/interface/les"
          rel="noreferrer"
        >
          {`Geth's light client guide`}
          <FiExternalLink />
        </a>
      </div>
      <h3>Connections</h3>
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={toggleMetamaskConnections}
          disabled={isConfigDisabled}
          style={{ marginLeft: 10 }}
        >
          <span>
            {sMetaMaskEnabled ? 'Disable' : 'Enable'} connections from{' '}
          </span>
          <img
            src={metamaskLogo}
            alt="Metamask logo"
            style={{ width: 100, marginLeft: 10 }}
          />
        </button>
        <a
          target="_blank"
          href="https://metamask.zendesk.com/hc/en-us/articles/360015290012-Using-a-Local-Node"
          rel="noreferrer"
        >
          {`MetaMask's local node guide`}
          <FiExternalLink />
        </a>
      </div>
      <h3>Restore default</h3>
      <div>
        <button
          type="button"
          onClick={async () => {
            setToDefaultNodeConfig();
          }}
          disabled={isConfigDisabled}
          style={{ marginLeft: 10 }}
        >
          <span>Set to NiceNode defaults</span>
        </button>
      </div>
      <h3>Direct input (for advanced users)</h3>
      <h4>
        Runtime input passed directly to the node. Enter an array of strings.
      </h4>
      <h5>
        Note: NiceNode uses http to talk with the node and get the node&apos;s
        current status (such as sync progress and number of peers). NiceNode
        uses the data directory path to calculate the storage the node has used.
      </h5>
      {sParseError && <span>{sParseError}</span>}
      <div>
        <textarea
          style={{
            minWidth: 400,
            minHeight: 150,
          }}
          value={sNodeConfigRaw}
          onChange={(e) => onChangeRawInput(e.target.value)}
          disabled={isConfigDisabled}
        />
      </div>

      {/* </><button
          type="button"
          onClick={async () => {
            setIsApplyChangesOpen(true);
          }}
          style={{ marginLeft: 10 }}
        >
          <span>Apply changes</span>
        </button>
      </><Modal
          isOpen={sIsApplyChangesOpen}
          title="Apply changes"
          onClickCloseButton={() => setIsApplyChangesOpen(false)}
        >
          <span>Are you sure you want to make these changes?</span>
        </Modal> */}
    </>
  );
};
export default NodeConfiguration;
