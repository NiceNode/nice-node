// Reference https://podman.io/docs/installation
export const script = `rm -rf /etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list
apt -y update -qq
apt install -y podman`;
