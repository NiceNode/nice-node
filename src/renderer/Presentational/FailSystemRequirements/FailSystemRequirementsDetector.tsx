import { useEffect } from 'react';
import electron from '../../electronGlobal';
import { setModalState } from '../../state/modal';
import { useAppDispatch } from '../../state/hooks';

const FailSystemRequirementsDetector = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const asyncData = async () => {
      const failSystemRequirementsData =
        await electron.getFailSystemRequirements();
      console.log(
        'pref failSystemRequirementsData',
        failSystemRequirementsData
      );
      if (failSystemRequirementsData.failedRequirements.length > 0) {
        // if there is a failed requirement, show the alert
        dispatch(
          setModalState({
            isModalOpen: true,
            screen: { route: 'failSystemRequirements', type: 'modal' },
          })
        );
      }
    };
    asyncData();
  }, [dispatch]);

  return <></>;
};

export default FailSystemRequirementsDetector;
