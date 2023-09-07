import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import { bottomBar, previousButton, nextButton } from './stepper.css';

export interface StepperProps {
  step?: number;
  /**
   * When a step changes ('previous' or 'next')
   */
  onChange: (change: 'next' | 'previous') => void;
  disabledSaveButton?: boolean;
}

const Stepper = ({ onChange, step, disabledSaveButton }: StepperProps) => {
  const { t: g } = useTranslation('genericComponents');
  const buttonDisabled = step === 2 && disabledSaveButton;

  return (
    <div className={bottomBar}>
      <div className={previousButton}>
        {step !== 0 && (
          <Button label={g('Previous')} onClick={() => onChange('previous')} />
        )}
      </div>
      <div className={nextButton}>
        <Button
          label={g('NextStep')}
          type="primary"
          disabled={buttonDisabled}
          onClick={() => onChange('next')}
        />
      </div>
    </div>
  );
};
export default Stepper;
