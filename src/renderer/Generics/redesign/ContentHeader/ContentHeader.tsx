import { HeaderButtonProps, HeaderButton } from '../HeaderButton/HeaderButton';
import {
  container,
  textContainer,
  titleStyle,
  subtitleStyle,
  leftButtonContainer,
  rightButtonContainer,
} from './contentHeader.css';

export interface ContentHeaderProps {
  /**
   * What's the title?
   */
  title: string;
  /**
   * What's the subtitle?
   */
  subtitle?: string;
  /**
   * Is there left button?
   */
  leftButtonIconId?: HeaderButtonProps;
  /**
   * Is there onClick event on the left button?
   */
  leftButtonOnClick?: () => void;
  /**
   * Is there right button?
   */
  rightButtonIconId?: HeaderButtonProps;
  /**
   * Is there onClick event on the right button?
   */
  rightButtonOnClick?: () => void;
  /**
   * Is this transparent?
   */
  transparent?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const ContentHeader = ({
  title,
  subtitle,
  leftButtonIconId,
  leftButtonOnClick,
  rightButtonIconId,
  rightButtonOnClick,
  transparent,
}: ContentHeaderProps) => {
  const transparentStyle = transparent ? 'transparent' : '';
  return (
    <div className={[container, transparentStyle].join(' ')}>
      {leftButtonIconId && (
        <div className={leftButtonContainer}>
          <HeaderButton type={leftButtonIconId} />
        </div>
      )}
      <div className={textContainer}>
        <div className={titleStyle}>{title}</div>
        <div className={subtitleStyle}>{subtitle}</div>
      </div>
      {rightButtonIconId && (
        <div className={rightButtonContainer}>
          <HeaderButton type={rightButtonIconId} />
        </div>
      )}
    </div>
  );
};
