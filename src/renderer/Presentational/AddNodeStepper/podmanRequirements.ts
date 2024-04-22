import type { PodmanDetails } from '../../../main/podman/details';

export const arePodmanRequirementsMet = (
  podmanDetails: PodmanDetails,
): boolean => {
  let isPodmanRequirementsMet = false;
  if (podmanDetails?.isRunning && !podmanDetails.isOutdated) {
    isPodmanRequirementsMet = true;
  }
  return isPodmanRequirementsMet;
};
