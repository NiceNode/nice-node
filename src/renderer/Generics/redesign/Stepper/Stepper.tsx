import Button from '../Button/Button';
import { bottomBar, previousButton, nextButton } from './stepper.css';

export interface StepperProps {
  /**
   * When a step changes ('previous' or 'next')
   */
  onChange: (change: 'next' | 'previous') => void;
}

const Stepper = ({ onChange }: StepperProps) => {
  return (
    <div className={bottomBar}>
      <div className={previousButton}>
        <Button label="Previous" onClick={() => onChange('previous')} />
      </div>
      <div className={nextButton}>
        <Button label="Next step" primary onClick={() => onChange('next')} />
      </div>
    </div>
  );
};
export default Stepper;
