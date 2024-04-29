import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FailSystemRequirementsData } from '../../../main/minSystemRequirement';
import { Checklist } from '../../Generics/redesign/Checklist/Checklist';
import type { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import electron from '../../electronGlobal';
import { makeCheckList } from '../FailSystemRequirements/requirementsChecklistUtil';

const FailSystemRequirementsModal = ({
  modalOnClose,
}: {
  modalOnClose: () => void;
}) => {
  const { t } = useTranslation('systemRequirements');
  const [sFailSystemRequirementsData, setFailSystemRequirementsData] =
    useState<FailSystemRequirementsData>();

  useEffect(() => {
    const asyncData = async () => {
      const failSystemRequirementsData =
        await electron.getFailSystemRequirements();
      console.log(
        'pref failSystemRequirementsData',
        failSystemRequirementsData,
      );
      setFailSystemRequirementsData(failSystemRequirementsData);
    };
    asyncData();
  }, []);

  const systemName =
    sFailSystemRequirementsData?.operatingSystem === 'macOS' ? 'Mac' : 'PC';
  const modalTitle = t('ThisSystemDoesNotMeetReqs', { systemName });

  const items: ChecklistItemProps[] = makeCheckList(
    t,
    sFailSystemRequirementsData,
  );

  return (
    <Modal
      modalTitle={modalTitle}
      modalStyle="failSystemRequirements"
      buttonSaveLabel={t('Quit NiceNode')}
      modalOnSaveConfig={() => {
        electron.closeApp();
      }}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <Checklist items={items} />
    </Modal>
  );
};

export default FailSystemRequirementsModal;
