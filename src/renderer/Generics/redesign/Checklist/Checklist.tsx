import { container } from './checklist.css';
import ChecklistItem from './ChecklistItem';
import HorizontalLine from '../HorizontalLine/HorizontalLine';

/**
 * Primary UI component for user interaction
 */
export const Checklist = (props: any) => {
  return (
    <div className={container} {...props}>
      <h2>Node hardware requirements</h2>

      <ChecklistItem
        status="loading"
        checkTitle="Processor supported by clients"
      />
      <HorizontalLine />

      <ChecklistItem
        status="complete"
        checkTitle="At least 4GB of system memory (RAM)"
        valueText="System memory: 32GB"
      />
      <HorizontalLine />

      <ChecklistItem
        status="incomplete"
        checkTitle="Storage disk type is SSD"
        valueText="Disk type: Hard Disk Drive (HDD)."
        captionText="While SSD is recommended you are still able to run a node with a HDD if you have 8GB or more of system memory (RAM) available."
      />
      <HorizontalLine />

      <ChecklistItem
        status="error"
        checkTitle="Available disk space for fast sync is 500GB or more"
        valueText="Selected disk: Macintosh HD with only 126GB free disk space."
        captionText=" Additional storage capacity is require to run this node type! Consider adding an external SSD."
      />
    </div>
  );
};
