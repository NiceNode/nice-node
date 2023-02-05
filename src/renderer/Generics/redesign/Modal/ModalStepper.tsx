import { modalStepperContainer } from './modal.css';
import Button from '../Button/Button';

export const ModalStepper = () => {
  return (
    <div className={modalStepperContainer}>
      <Button variant="text" type="secondary" label="Cancel" />
      <Button variant="text" type="primary" label="Save" />
    </div>
  );
};
