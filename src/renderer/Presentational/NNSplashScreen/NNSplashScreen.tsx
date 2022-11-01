import Splash from '../../Generics/redesign/Splash/Splash';
import icon from '../../assets/images/logo/mono.svg';

const NNSplash = ({
  onClickGetStarted,
}: {
  onClickGetStarted?: () => void;
}) => {
  return (
    <Splash
      // icon={icon}
      title="Welcome to NiceNode"
      description="Run a node how you want it — without commands and a terminal. NiceNode shows what the node is doing at a glance. Stats like how many peer nodes are connected and synching progress are built into the app."
      onClickGetStarted={onClickGetStarted}
    />
  );
};
export default NNSplash;
