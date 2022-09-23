import React from 'react';
import { Button } from '../Button';
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
        <button type="button" className={previousButton}>
          Previous
        </button>
        <button type="button" className={nextButton}>
          Next
        </button>
      </div>
    </div>
  );
};
export default Stepper;
