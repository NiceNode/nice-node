// Reference https://podman.io/docs/installation
// first line is to remove a depracted apt source that will conflict with the official one
export const script = `
rm -rf /etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list
apt -y update -qq
apt install -y podman
`;
