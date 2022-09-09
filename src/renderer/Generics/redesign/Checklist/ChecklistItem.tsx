import { container, iconCss } from './checklistItem.css.ts';
// import CheckCircleFill from '../../../assets/images/icons/CheckCircleFill.svg';
import CheckCircleFillIcon from '../Icons/CheckCircleFill';

// import { Icon } from '../Icon/Icon2';
// import { ReactComponent as Logo } from './logo.svg';

/**
 * Primary UI component for user interaction
 */
const ChecklistItem = (props: any) => {
  return (
    <div className={container} {...props}>
      {/* <p className={iconCss}> */}
      {/* <Icon iconId="settings" variant="icon-left" /> */}
      <CheckCircleFillIcon />
      {/* </p> */}
      <p>Checklist Item</p>
    </div>
  );
};

export default ChecklistItem;
