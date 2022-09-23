import React from 'react';
import { Button } from '../Button/Button';
import { bottomBar, previousButton, nextButton } from './stepper.css';

export interface StepperProps {
  /**
   * When a step changes ('prev' or 'next')
   */
  onChange?: (change: string) => void;
  /**
   * The current step component to show
   */
  children?: React.ReactNode;
}

const Stepper = ({ onChange, children }: StepperProps) => {
  return (
    <div>
      {children}
      <div className={bottomBar}>
        <div className={previousButton}>
          <Button label="Previous" />
        </div>
        <div className={nextButton}>
          <Button label="Next step" primary />
        </div>
      </div>
    </div>
  );
};
export default Stepper;
