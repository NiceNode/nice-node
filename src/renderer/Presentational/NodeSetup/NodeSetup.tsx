import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Splash from '../../Generics/redesign/Splash/Splash';
import electron from '../../electronGlobal';
import AddNodeStepper from '../AddNodeStepper/AddNodeStepper';
import FailSystemRequirementsDetector from '../FailSystemRequirements/FailSystemRequirementsDetector';

const NodeSetup = () => {
  const [hasClicked, setHasClicked] = useState(false);
  const navigate = useNavigate();

  if (!hasClicked) {
    return (
      <>
        <Splash onClickGetStarted={() => setHasClicked(true)} />
        <FailSystemRequirementsDetector />
      </>
    );
  }
  return (
    <AddNodeStepper
      onChange={(newValue: 'done' | 'cancel') => {
        if (newValue === 'done' || newValue === 'cancel') {
          navigate('/main/nodePackage');
          electron.getSetHasSeenSplashscreen(true);
        }
      }}
    />
  );
};

export default NodeSetup;
