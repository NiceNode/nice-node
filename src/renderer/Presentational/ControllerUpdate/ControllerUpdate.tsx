import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { injectDefaultControllerConfig } from '../../../common/node-spec-tool/injectDefaultControllerConfig.js';
import {
  type UserSpecDiff,
  calcUserSpecDiff,
} from '../../../common/node-spec-tool/specDiff.js';
import type Node from '../../../common/node.js';
import type { NodeSpecification } from '../../../common/nodeSpec.js';
import Linking from '../../Generics/redesign/Link/Linking.js';
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
} from './controllerUpdate.css.js';

const ControllerUpdate = () => {
  const { t } = useTranslation();
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(
    sSelectedNode,
  );
  const [sLatestController, setLatestController] = useState<
    NodeSpecification | undefined
  >();
  const [sChangeMessage, setChangeMessage] = useState<string>();
  const [sUserSpecDiffs, setUserSpecDiffs] = useState<
    UserSpecDiff[] | undefined
  >();

  const getAndSetLatestController = async () => {
    const latestControllerIfNewerAvailable: NodeSpecification | undefined =
      await electron.getCheckForControllerUpdate(selectedNode?.id);
    if (latestControllerIfNewerAvailable) {
      setLatestController(latestControllerIfNewerAvailable);
    }
  };

  useEffect(() => {
    getAndSetLatestController();
  }, [selectedNode]);

  useEffect(() => {
    let newSpecDiffs;
    if (selectedNode?.spec && sLatestController) {
      // This should always be run before calcUserSpecDiff
      //  otherwise default config not included in the newSpec will show as removed
      injectDefaultControllerConfig(sLatestController);
      newSpecDiffs = calcUserSpecDiff(selectedNode?.spec, sLatestController);
    }
    setUserSpecDiffs(newSpecDiffs);
  }, [sLatestController]);

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

export default ControllerUpdate;
