// Same script as on https://podman.io/docs/installation, except the 'sudo' is removed as
//  sudo-prompt will not execute a command with sudo
export const script = `apt-get -y update -qq
apt-get -y install curl
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.opensuse.org/repositories/devel:kubic:libcontainers:unstable/Debian_Unstable/Release.key \
  | gpg --dearmor \
  | tee /etc/apt/keyrings/devel_kubic_libcontainers_unstable.gpg > /dev/null
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/devel_kubic_libcontainers_unstable.gpg]\
    https://download.opensuse.org/repositories/devel:kubic:libcontainers:unstable/Debian_Unstable/ /" \
  | tee /etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list > /dev/null
apt-get -y update
apt-get -y upgrade
apt-get -y install podman`;
