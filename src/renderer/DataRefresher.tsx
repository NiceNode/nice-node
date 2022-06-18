import { useEffect } from 'react';
import { useAppSelector } from './state/hooks';
import { selectSelectedNode, selectSelectedNodeId } from './state/node';
import electron from './electronGlobal';
import { useGetNodeVersionQuery } from './state/services';

const DataRefresher = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation
  );

  useEffect(() => {
    const updateNodeDU = async () => {
      // todo: fix warnings for multi-client
      if (sSelectedNodeId) {
        await electron.updateNodeUsedDiskSpace(sSelectedNodeId);
      }
    };
    updateNodeDU();
    const intveral = setInterval(updateNodeDU, 120000);
    return () => clearInterval(intveral);
  }, [sSelectedNodeId]);

  useEffect(() => {
    console.log(
      'DataRefresher: selected node or nodeVersion query changed. Refetching node version.'
    );
    qNodeVersion.refetch();
    // RTKQ does not work as a dependency. Will cause an infinite loop if included.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);
  return <></>;
};
export default DataRefresher;
