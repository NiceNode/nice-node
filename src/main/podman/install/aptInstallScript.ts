// Reference https://podman.io/docs/installation
// first line is to remove a depracted apt source that will conflict with the official one
export const script = `
apt -y update -qq
apt install -y podman`;
