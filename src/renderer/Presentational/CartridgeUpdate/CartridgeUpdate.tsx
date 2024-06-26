import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type UserSpecDiff,
  calcUserSpecDiff,
} from '../../../common/node-spec-tool/specDiff.js';
import type Node from '../../../common/node.js';
import type { NodeSpecification } from '../../../common/nodeSpec.js';
import Linking from '../../Generics/redesign/Link/Linking';
import alphaBanner from '../../assets/images/artwork/alphaBanner.svg';
import electron from '../../electronGlobal.js';
import { useAppSelector } from '../../state/hooks.js';
import { selectSelectedNode } from '../../state/node.js';
import {
  container,
  contentContainer,
  contentMajorTitle,
  contentSection,
  contentTitle,
  topBanner,
} from './cartridgeUpdate.css';

const CartridgeUpdate = () => {
  const { t } = useTranslation();
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(
    sSelectedNode,
  );
  const [sLatestCartridge, setLatestCartridge] = useState<
    NodeSpecification | undefined
  >();
  const [sChangeMessage, setChangeMessage] = useState<string>();
  const [sUserSpecDiffs, setUserSpecDiffs] = useState<
    UserSpecDiff[] | undefined
  >();

  const getAndSetLatestCartridge = async () => {
    const latestCartridgeIfNewerAvailable: NodeSpecification | undefined =
      await electron.getCheckForCartridgeUpdate(selectedNode?.id);
    if (latestCartridgeIfNewerAvailable) {
      setLatestCartridge(latestCartridgeIfNewerAvailable);
    }
  };

  useEffect(() => {
    getAndSetLatestCartridge();
  }, [selectedNode]);

  useEffect(() => {
    let newSpecDiffs;
    if (selectedNode?.spec && sLatestCartridge) {
      newSpecDiffs = calcUserSpecDiff(selectedNode?.spec, sLatestCartridge);
    }
    setUserSpecDiffs(newSpecDiffs);
  }, [sLatestCartridge]);

  return (
    <div className={container}>
      <div className={contentContainer}>
        <div className={contentSection}>
          {sUserSpecDiffs?.map((diff: UserSpecDiff, index: number) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            return <div key={index}>{diff.message}</div>;
          })}
          <p>{JSON.stringify(sChangeMessage)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartridgeUpdate;
