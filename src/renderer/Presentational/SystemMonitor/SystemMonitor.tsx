import { SystemMonitor as SystemMonitorComponent } from 'renderer/Generics/redesign/SystemMonitor/SystemMonitor';
import { headerContainer, titleStyle } from './systemMonitor.css';

const SystemMonitor = () => {
  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>System monitor</div>
      </div>
      <SystemMonitorComponent />
    </>
  );
};
export default SystemMonitor;
