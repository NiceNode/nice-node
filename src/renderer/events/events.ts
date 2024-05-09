export type NNEvent =
  | 'OpenApp'
  | 'AddNode'
  | 'AddNodePackage'
  | 'RemoveNodePackage'
  | 'InstalledPodman'
  | 'OpenAddNodeModal'
  | 'UpdatedNiceNode'
  | 'UserCheckForUpdateNN'
  | 'DisablePreReleaseUpdates'
  | 'EnablePreReleaseUpdates'
  | 'DisableEventReporting'
  | 'EnableEventReporting';
