import { NodeSpecification } from '../../common/nodeSpec';
import DivButton from '../DivButton';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';

import DockerLogo from '../../../assets/docker_400x400.jpg';

const NodeCard = (props: {
  nodeSpec: NodeSpecification;
  onSelected: () => void;
}) => {
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  // eslint-disable-next-line react/destructuring-assignment
  const { nodeSpec, onSelected } = props;
  const { displayName, iconUrl } = nodeSpec;
  // const isDisabled = true;
  const isDockerInstalled = qIsDockerInstalled?.data;
  const isDockerRequired =
    nodeSpec.execution.executionTypes.length === 1 &&
    nodeSpec.execution.executionTypes[0] === 'docker';

  const isDisabled = isDockerRequired && !isDockerInstalled;
  const opacity = isDisabled ? '0.5' : '1';

  return (
    <DivButton
      key={displayName}
      style={{
        border: '1px solid',
        padding: 2,
        borderRadius: 5,
        width: 120,
        height: 120,
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
        opacity,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onSelected}
    >
      <div
        style={{
          height: 50,
          width: 100,
          display: 'flex',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={iconUrl}
          alt={displayName}
          style={{ maxWidth: '100%', maxHeight: 50, objectFit: 'contain' }}
        />
      </div>
      <div
        style={{
          maxHeight: 45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          width: '100%',
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        {displayName}
      </div>
      {nodeSpec.nodeReleasePhase &&
        ['alpha', 'beta'].includes(nodeSpec.nodeReleasePhase) && (
          <div
            style={{
              display: 'inline-block',
              background: 'yellow',
              borderRadius: 5,
              padding: 3,
              alignSelf: 'flex-start',
            }}
          >
            <span>{nodeSpec.nodeReleasePhase}</span>
          </div>
        )}
      {isDockerRequired && isDisabled && (
        <div
          style={{
            width: 30,
            height: 30,
            position: 'relative',
            opacity: 1,
            bottom: 35,
            left: 65,
          }}
        >
          <img
            src={DockerLogo}
            alt="Docker"
            style={{ maxWidth: '100%', maxHeight: 30 }}
          />
        </div>
      )}
    </DivButton>
  );
};
export default NodeCard;
