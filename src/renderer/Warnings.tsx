import { useEffect, useState } from 'react';
import { CgCloseO } from 'react-icons/cg';
import { ImWarning } from 'react-icons/im';

import electron from './electronGlobal';
import IconButton from './IconButton';
import { useAppDispatch, useAppSelector } from './state/hooks';
import {
  selectNumGethDiskUsedGB,
  selectNumFreeDiskGB,
  updateNodeNumGethDiskUsedGB,
  updateSystemNumFreeDiskGB,
} from './state/node';

const Warnings = () => {
  const dispatch = useAppDispatch();
  const sGethDiskUsed = useAppSelector(selectNumGethDiskUsedGB);
  const sFreeDisk = useAppSelector(selectNumFreeDiskGB);

  const [sIsOpen, setIsOpen] = useState<boolean>(false);
  const [sHasBeenClosed, setHasBeenClosed] = useState<boolean>(false);
  const [sWarnings, setWarnings] = useState<string[]>();
  const [sStorageWarning, setStorageWarning] = useState<boolean>();

  const getSystemWarnings = async () => {
    const warnings = await electron.checkSystemHardware();
    setWarnings(warnings);
  };

  useEffect(() => {
    const updateGethDiskUsed = async () => {
      const gethDiskUsed = await electron.getGethDiskUsed();
      if (gethDiskUsed) {
        dispatch(updateNodeNumGethDiskUsedGB(gethDiskUsed));
      }
    };
    updateGethDiskUsed();
    const intveral = setInterval(updateGethDiskUsed, 30000);
    return () => clearInterval(intveral);
  }, [dispatch]);

  useEffect(() => {
    const updateFreeDisk = async () => {
      const freeDisk = await electron.getSystemFreeDiskSpace();
      if (freeDisk) {
        dispatch(updateSystemNumFreeDiskGB(freeDisk));
      }
    };
    updateFreeDisk();
    const intveral = setInterval(updateFreeDisk, 30000);
    return () => clearInterval(intveral);
  }, [dispatch]);

  useEffect(() => {
    if (sFreeDisk !== undefined && sGethDiskUsed !== undefined) {
      if (sGethDiskUsed + sFreeDisk > 1000) {
        setStorageWarning(false);
      } else {
        setStorageWarning(true);
      }
    }
  }, [sGethDiskUsed, sFreeDisk, sStorageWarning]);

  useEffect(() => {
    // don't show the warning if it has already been closed
    if (sHasBeenClosed) {
      return;
    }
    if ((sWarnings && sWarnings.length > 0) || sStorageWarning) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [sHasBeenClosed, sWarnings, sStorageWarning]);

  useEffect(() => {
    getSystemWarnings();
  }, []);

  return (
    <div
      style={{
        maxWidth: 400,
        background: 'rgb(255, 255, 204)',
        borderRadius: 5,
        padding: '1rem',
        color: '#333333',
        display: 'flex',
        flexDirection: 'row',
        visibility: sIsOpen ? 'visible' : 'hidden',
      }}
    >
      <span>
        <ImWarning />
      </span>
      <div
        style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}
      >
        {sWarnings?.map((warning) => {
          return (
            <div style={{ marginBottom: 5 }}>
              <span key={warning}>- {warning}</span>
            </div>
          );
        })}
        {sStorageWarning && (
          <div style={{ marginBottom: 5 }}>
            <span>
              - At least 1 TB of storage is required to run an Ethereum Node.
              Your computer does not have enough free SSD storage space.
            </span>
          </div>
        )}
        {((sWarnings && sWarnings.length > 0) || sStorageWarning) && (
          <div style={{ marginTop: 5 }}>
            <span>
              Please visit ethereum.org to see computer hardware requirements at
              <a href="https://ethereum.org/en/run-a-node/#build-your-own">
                ethereum.org/run-a-node
              </a>
            </span>
          </div>
        )}
      </div>
      <span>
        <IconButton
          type="button"
          onClick={() => {
            setIsOpen(false);
            setHasBeenClosed(true);
          }}
          style={{ paddingRight: 0, paddingTop: 0 }}
        >
          <CgCloseO />
        </IconButton>
      </span>
    </div>
  );
};
export default Warnings;
