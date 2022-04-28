import Node, { NodeOptions } from './node';

const nodes: Node[] = [];

export const getNodes = () => {
  return nodes;
};

export const addNode = (nodeOptions: NodeOptions) => {
  const node = new Node(nodeOptions);
  nodes.push(node);
  return node;
};
