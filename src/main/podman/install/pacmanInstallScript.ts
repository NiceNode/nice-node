// Same script as on https://podman.io/docs/installation, except the 'sudo' is removed as
//  sudo-prompt will not execute a command with sudo
export const script = 'pacman -Syu --noconfirm && pacman -S podman --noconfirm';
