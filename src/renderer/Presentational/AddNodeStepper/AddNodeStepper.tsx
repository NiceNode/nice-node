// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { componentContainer, container } from './addNodeStepper.css';
import Stepper from '../../Generics/redesign/Stepper/Stepper';
import AddEthereumNode from '../AddEthereumNode/AddEthereumNode';
import DockerInstallation from '../DockerInstallation/DockerInstallation';
import NodeRequirements from '../NodeRequirements/NodeRequirements';

export interface AddNodeStepperProps {
  onChange: (newValue: 'done' | 'cancel') => void;
}

const TOTAL_STEPS = 3;

const AddNodeStepper = ({ onChange }: AddNodeStepperProps) => {
  const { t } = useTranslation();
  const [sStep, setStep] = useState<number>(0);

  const onChangeAddEthereumNode = (newValue: string) => {
    console.log('onChangeAddEthereumNode newValue ', newValue);
  };

  const onStep = (newValue: string) => {
    console.log('onChangeAddEthereumNode newValue ', newValue);
    if (newValue === 'next') {
      // = sign because sStep index starts at 0
      if (sStep + 1 >= TOTAL_STEPS) {
        // done
        onChange('done');
      } else {
        setStep(sStep + 1);
      }
    } else if (newValue === 'previous') {
      if (sStep - 1 < 0) {
        // cancelled
        onChange('cancel');
      } else {
        setStep(sStep - 1);
      }
    }
  };

  return (
    <div className={container}>
      <div className={componentContainer}>
        {/* Step 0 */}
        <div style={{ display: sStep === 0 ? '' : 'none' }}>
          <AddEthereumNode onChange={onChangeAddEthereumNode} />
        </div>

        {/* Step 1 */}
        <div style={{ display: sStep === 1 ? '' : 'none' }}>
          <NodeRequirements
            nodeRequirements={undefined}
            systemData={undefined}
          />
        </div>

        {/* Step 2 */}
        <div style={{ display: sStep === 2 ? '' : 'none' }}>
          <DockerInstallation onChange={onChangeAddEthereumNode} />
        </div>
      </div>

      <div>
        <Stepper onChange={onStep} />
      </div>
    </div>
  );
};

export default AddNodeStepper;
