import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { NodeStatus } from '../common/node';
import electron from './electronGlobal';
import InstallDocker from './Docker/InstallDocker';
// import { useGetNodesQuery } from './state/nodeService';
import { useAppSelector } from './state/hooks';
import { selectSelectedNode } from './state/node';
import { useGetNodeVersionQuery } from './state/services';
import { useGetIsDockerInstalledQuery } from './state/settingsService';

const NodeScreen = () => {
  const { t } = useTranslation();
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation
  );
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  // const isDisabled = true;
  const isDockerInstalled = qIsDockerInstalled?.data;
  // useEffect(() => {
  //   qNodeInfo.refetch();
  // }, [selectedNode]);

  // Will select the Node with the given id, and will only rerender if the given Node data changes
  // https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result
  // const { selectedNode } = useGetNodesQuery(undefined, {
  //   selectFromResult: ({ data }: { data: Node[] }) => {
  //     return {
  //       selectedNode: data?.find((node) => node.id === sSelectedNodeId),
  //     };
  //   },
  // });
  if (!selectedNode) {
    // if docker is not installed, show prompt
    if (!isDockerInstalled) {
      if (qIsDockerInstalled.isLoading) {
        return <>Loading...</>;
      }
      return <InstallDocker />;
    }
    return <div>No node selected</div>;
  }

  const { status, spec } = selectedNode;
  const { category, displayName } = spec;

  return (
    <div>
      <div>
        <h1>{displayName}</h1>
        {status === 'running' && qNodeVersion && (
          <h4>
            Version:{' '}
            <>
              {qNodeVersion.isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  {qNodeVersion.isError ? (
                    <>Loading..</>
                  ) : (
                    qNodeVersion.currentData
                  )}
                </>
              )}
            </>
          </h4>
        )}
        <h4>
          {t('Type')}: {category} Node
        </h4>
        <h3>
          {t('Status')}: {t(status)}
        </h3>
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={() => electron.startNode(selectedNode.id)}
          disabled={
            !(
              status === NodeStatus.created ||
              status === NodeStatus.readyToStart ||
              status === NodeStatus.errorStarting ||
              status === NodeStatus.errorRunning ||
              status === NodeStatus.stopped ||
              status === NodeStatus.errorStopping ||
              status === NodeStatus.unknown
            )
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaPlayCircle style={{ marginRight: 5 }} />
            {t('Start')}
          </div>
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => electron.stopNode(selectedNode.id)}
          disabled={status !== NodeStatus.running}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaPauseCircle style={{ marginRight: 5 }} />
            {t('Stop')}
          </div>
        </button>
      </div>
    </div>
  );
};
export default NodeScreen;
