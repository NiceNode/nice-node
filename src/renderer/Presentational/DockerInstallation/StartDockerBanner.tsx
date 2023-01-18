import electron from '../../electronGlobal';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import { useGetIsDockerRunningQuery } from '../../state/settingsService';

export const DockerStoppedBanner = () => {
  const qIsDockerRunning = useGetIsDockerRunningQuery(null, {
    pollingInterval: 15000,
  });

  const onClickStartDocker = async () => {
    await electron.startDocker();
    // todo: verify it is started and changed banner for 5 secs?
    qIsDockerRunning.refetch();
    // console.log('installDocker finished. Install result: ', installResult);
  };

  return (
    <Banner dockerStopped onClick={onClickStartDocker} />
    // <div
    //   style={updateAvailable ? { cursor: 'pointer' } : {}}
    //   className={container}
    //   onClick={onClick}
    //   onKeyDown={onClick}
    //   role="button"
    //   tabIndex={0}
    // >
    //   <div className={innerContainer}>
    //     <Icon iconId={iconId} />
    //     <div className={textContainer}>
    //       <div className={titleStyle}>{title}</div>
    //       <div className={descriptionStyle}>{description}</div>
    //     </div>
    //   </div>
    // </div>
  );
};
