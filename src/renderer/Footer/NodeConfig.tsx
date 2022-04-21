import { useEffect, useState } from 'react';
import electron from '../electronGlobal';

import { NODE_STATUS } from '../messages';
import { useAppSelector } from '../state/hooks';
import { selectNodeStatus } from '../state/node';

const NodeConfig = () => {
  const [sNodeConfigRaw, setNodeConfigRaw] = useState<string>();
  const [sParseError, setParseError] = useState<string>();
  const sNodeStatus = useAppSelector(selectNodeStatus);

  const getNodeConfig = async () => {
    const nodeConfig = await electron.getNodeConfig();
    setNodeConfigRaw(JSON.stringify(nodeConfig, null, 2));
  };

  const setToDefaultNodeConfig = async () => {
    await electron.setToDefaultNodeConfig();
    await getNodeConfig();
  };

  useEffect(() => {
    getNodeConfig();
  }, []);

  useEffect(() => {
    if (sNodeConfigRaw) {
      try {
        const nodeConfigInput = JSON.parse(sNodeConfigRaw);
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
          electron.setStoreValue('nodeConfig', nodeConfigInput);
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
  }, [sNodeConfigRaw]);

  const isConfigDisabled = !(
    sNodeStatus === NODE_STATUS.readyToStart ||
    sNodeStatus === NODE_STATUS.stopped
  );

  return (
    <>
      <h2>Node</h2>
      <h3>Configuration</h3>
      {isConfigDisabled && (
        <h5>The node must be stopped to make configuration changes.</h5>
      )}
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
          onChange={(e) => setNodeConfigRaw(e.target.value)}
          disabled={isConfigDisabled}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={async () => {
            setToDefaultNodeConfig();
          }}
          style={{ marginLeft: 10 }}
        >
          <span>Set to default configuration</span>
        </button>
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
export default NodeConfig;
