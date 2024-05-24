FROM fedora:40

RUN dnf update -y

RUN dnf install podman -y

# RUN  apt-get install --no-install-recommends -y nodejs npm git zip dpkg fakeroot rpm libarchive-tools
# RUN  apt-get install -y \
#       xvfb \
#       zip \
#       wget \
#       ca-certificates \
#       libnss3-dev \
#       libasound2t64 \
#       libxss1 \
#       libappindicator3-1 \
#       libindicator7 \
#       xdg-utils \
#       fonts-liberation \
#       libgbm1

# Create a new user and set its password
# RUN useradd -ms /bin/bash -g root -u 1000 myuser \
#     && echo "myuser:password" | chpasswd

# Create a new group for Podman
RUN groupadd --system podman

# Create a new user and group for running Podman within the container
ARG USERNAME=podman-user
ARG USER_UID=1000
ARG GROUP_GID=1000
RUN groupadd -g ${GROUP_GID} ${USERNAME} && \
    useradd -u ${USER_UID} -g ${GROUP_GID} -m ${USERNAME}

# Add the user to the 'podman' group
RUN usermod -aG podman ${USERNAME}

# Switch to the new user
USER ${USERNAME}

# Set the working directory to the user's home directory
WORKDIR /home/${USERNAME}

# Example command to run when the container starts
CMD ["/bin/bash"]
