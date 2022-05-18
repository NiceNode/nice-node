import { useEffect, useState } from 'react';

import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
import {
  UIConfigTranslation,
  EthNodeUIConfigTranslation,
  ConfigTranslationControl,
} from '../../common/nodeConfig';
import electron from '../electronGlobal';

type Props = {
  isDisabled: boolean;
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
};
const Select = ({ isDisabled, options, value, onChange }: Props) => {
  return (
    <>
      return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      );
    </>
  );
};
export default Select;
