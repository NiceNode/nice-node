import { ReportEventData } from 'renderer/events/reportEvent';
import { CHANNELS, send } from './messenger';

export const reportEvent = (event: string, eventData?: ReportEventData) => {
  send(CHANNELS.reportEvent, event, eventData);
};
