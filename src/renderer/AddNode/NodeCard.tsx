import { NodeOptions } from '../../main/node';
import DivButton from '../DivButton';

const NodeCard = (props: {
  nodeOptions: NodeOptions;
  onSelected: () => void;
}) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { nodeOptions, onSelected } = props;
  const { displayName, iconUrl, category, executionType } = nodeOptions;
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
    </DivButton>
  );
};
export default NodeCard;
