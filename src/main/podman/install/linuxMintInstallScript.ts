// Same script as on https://podman.io/docs/installation, except the 'sudo' is removed as
//  sudo-prompt will not execute a command with sudo
export const script = `apt -y update -qq
apt -qq -y install podman`;
