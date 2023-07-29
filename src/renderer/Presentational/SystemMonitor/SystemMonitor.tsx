import { SystemMonitor as SystemMonitorLabels } from '../../Generics/redesign/SystemMonitor/SystemMonitor';
import { headerContainer, titleStyle } from './systemMonitor.css';

const SystemMonitor = () => {
  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>System monitor</div>
      </div>
      <SystemMonitorLabels />
    </>
  );
};
export default SystemMonitor;
