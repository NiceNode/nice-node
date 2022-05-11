import { useEffect } from 'react';
import { useAppSelector } from './state/hooks';
import { selectSelectedNodeId } from './state/node';
import electron from './electronGlobal';

const DataRefresher = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);

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
  return <></>;
};
export default DataRefresher;
