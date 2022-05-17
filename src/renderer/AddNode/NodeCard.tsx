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
        width: 100,
        height: 100,
        marginLeft: 5,
        marginRight: 10,
        opacity,
      }}
      onClick={onSelected}
    >
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={iconUrl}
          alt={displayName}
          style={{ maxWidth: '100%', maxHeight: 50 }}
        />
      </div>
      <div
        style={{
          height: 50,
        }}
      >
        <span style={{ textOverflow: 'ellipsis' }}>{displayName}</span>
      </div>
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
