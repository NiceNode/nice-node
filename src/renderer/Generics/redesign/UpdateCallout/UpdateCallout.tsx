import { useTranslation } from 'react-i18next';
import {
  buttonContainer,
  container,
  description,
  link,
  title,
} from './updateCallout.css';

import Button from '../Button/Button';
import ExternalLink from '../Link/ExternalLink';
import InternalLink from '../Link/InternalLink.js';
import { useAppSelector } from '../../../state/hooks.js';
import { selectSelectedNode } from '../../../state/node.js';
import { useEffect, useState } from 'react';
import { NodeSpecification } from '../../../../common/nodeSpec.js';
import electron from '../../../electronGlobal.js';
import type Node from '../../../../common/node.js';

export interface UpdateCalloutProps {
  onClick: () => void;
  serviceName: string;
  releaseNotesUrl?: string;
  onClickShowChanges?: () => void;
}

export const UpdateCallout = ({
  onClick,
  serviceName,
  releaseNotesUrl,
  onClickShowChanges,
}: UpdateCalloutProps) => {
  const { t: g } = useTranslation('genericComponents');
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(
    sSelectedNode,
  );
  const [sLatestCartridge, setLatestCartridge] = useState<
    NodeSpecification | undefined
  >();
  const [sChangeMessage, setChangeMessage] = useState<string>();

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
    const changeMessage = gen(); // todo: spec tool gen func
    setChangeMessage(changeMessage);
  }, [sLatestCartridge]);

  const onInstallClick = () => {
    onClick();
    console.log('install action!');
  };
  console.log('UpdateCallout releaseNotesUrl', releaseNotesUrl);
  return (
    <div className={container}>
      <div className={title}>{g('UpdateClient')}</div>
      <div className={description}>
        {g('UpdateClientDescription', {
          client: serviceName,
        })}
      </div>
      {releaseNotesUrl && (
        <div className={link}>
          <ExternalLink
            text={g('ViewNamedReleaseNotes', {
              name: serviceName,
            })}
            url={releaseNotesUrl}
          />
        </div>
      )}
      {onClickShowChanges && (
        <div className={link}>
          <InternalLink
            text={g('ViewDetailedChanges')}
            onClick={onClickShowChanges}
          />
        </div>
      )}
      <div className={buttonContainer}>
        <Button
          type="primary"
          wide
          label={g('InstallUpdate')}
          size="small"
          onClick={onInstallClick}
        />
        <Button wide label={g('Skip')} size="small" onClick={onClick} />
      </div>
    </div>
  );
};
