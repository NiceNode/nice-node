import electron from '../../electronGlobal';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';

export const PodmanStoppedBanner = () => {
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });

  const onClickStartPodman = async () => {
    await electron.startPodman();
    // todo: verify it is started and changed banner for 5 secs?
    qIsPodmanRunning.refetch();
    // console.log('installPodman finished. Install result: ', installResult);
  };

  return <Banner dockerStopped onClick={onClickStartPodman} />;
};
