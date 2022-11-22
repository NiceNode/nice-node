import { HeaderButton } from '../HeaderButton/HeaderButton';
import {
  container,
  textContainer,
  titleStyle,
  subtitleStyle,
  spacer,
} from './contentHeader.css';

export interface ContentHeaderProps {
  /**
   * What's the text alignment?
   */
  textAlign?: string;
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
  leftButtonIconId?: string;
  /**
   * Is there onClick event on the left button?
   */
  leftButtonOnClick?: () => void;
  /**
   * Is there right button?
   */
  rightButtonIconId?: string;
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
  leftButtonOnClick = () => {},
  rightButtonIconId,
  rightButtonOnClick = () => {},
  transparent,
  textAlign,
}: ContentHeaderProps) => {
  const transparentStyle = transparent ? 'transparent' : '';
  return (
    <div className={[container, transparentStyle].join(' ')}>
      {leftButtonIconId && (
        <HeaderButton type={leftButtonIconId} onClick={leftButtonOnClick} />
      )}
      <div className={[textContainer, textAlign].join(' ')}>
        <div className={titleStyle}>{title}</div>
        <div className={subtitleStyle}>{subtitle}</div>
      </div>
      {textAlign === 'left' && <div className={spacer} />}
      {rightButtonIconId && (
        <HeaderButton type={rightButtonIconId} onClick={rightButtonOnClick} />
      )}
    </div>
  );
};
