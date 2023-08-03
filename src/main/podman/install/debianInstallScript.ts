export const script = `sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.opensuse.org/repositories/devel:kubic:libcontainers:unstable/Debian_Unstable/Release.key \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/devel_kubic_libcontainers_unstable.gpg > /dev/null
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/devel_kubic_libcontainers_unstable.gpg]\
    https://download.opensuse.org/repositories/devel:kubic:libcontainers:unstable/Debian_Unstable/ /" \
  | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list > /dev/null
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install podman`;
