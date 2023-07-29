import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import electron from '../../electronGlobal';
import NNSplash from '../NNSplashScreen/NNSplashScreen';
import AddNodeStepper from '../AddNodeStepper/AddNodeStepper';

const NodeSetup = () => {
  const [hasClicked, setHasClicked] = useState(false);
  const navigate = useNavigate();

  if (!hasClicked) {
    return <NNSplash onClickGetStarted={() => setHasClicked(true)} />;
  }
  return (
    <AddNodeStepper
      onChange={(newValue: 'done' | 'cancel') => {
        if (newValue === 'done' || newValue === 'cancel') {
          navigate('/main/node');
          electron.getSetHasSeenSplashscreen(true);
        }
      }}
    />
  );
};

export default NodeSetup;
