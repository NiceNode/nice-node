# podman/Containerfile
#
# Build a Podman container image from the latest
# stable version of Podman on the Fedoras Updates System.
# https://bodhi.fedoraproject.org/updates/?search=podman
# This image can be used to create a secured container
# that runs safely with privileges within the container.
#
# FLAVOR defaults to stable if unset
#
# FLAVOR=stable    acquires a stable version of Podman
#                   from the Fedoras Updates System.
# FLAVOR=testing   acquires a testing version of Podman
#                   from the Fedoras Updates System.
# FLAVOR=upstream  acquires a testing version of Podman
#                   from the Fedora Copr Buildsystem.
#                   https://copr.fedorainfracloud.org/coprs/rhcontainerbot/podman-next/
#
# https://bodhi.fedoraproject.org/updates/?search=podman

FROM registry.fedoraproject.org/fedora:latest
ARG FLAVOR=stable

# When building for multiple-architectures in parallel using emulation
# it's really easy for one/more dnf processes to timeout or mis-count
# the minimum download rates.  Bump both to be extremely forgiving of
# an overworked host.
RUN echo -e "\n\n# Added during image build" >> /etc/dnf/dnf.conf && \
    echo -e "minrate=100\ntimeout=60\n" >> /etc/dnf/dnf.conf

# Don't include container-selinux and remove
# directories used by dnf that are just taking
# up space.
# TODO: rpm --setcaps... needed due to Fedora (base) image builds
#       being (maybe still?) affected by
#       https://bugzilla.redhat.com/show_bug.cgi?id=1995337#c3
RUN dnf -y makecache && \
    dnf -y update && \
    rpm --setcaps shadow-utils 2>/dev/null && \
    case "${FLAVOR}" in \
      stable) \
        dnf -y install podman fuse-overlayfs openssh-clients --exclude container-selinux \
      ;; \
      testing) \
        dnf -y install podman fuse-overlayfs openssh-clients --exclude container-selinux \
            --enablerepo updates-testing \
      ;; \
      upstream) \
        dnf -y install 'dnf-command(copr)' --enablerepo=updates-testing && \
        dnf -y copr enable rhcontainerbot/podman-next && \
        dnf -y install podman fuse-overlayfs openssh-clients \
            --exclude container-selinux \
            --enablerepo=updates-testing \
      ;; \
      *) \
        printf "\\nFLAVOR argument must be set and valid, currently: '${FLAVOR}'\\n\\n" 1>&2 && \
        exit 1 \
      ;; \
    esac && \
    dnf clean all && \
    rm -rf /var/cache /var/log/dnf* /var/log/yum.*

RUN useradd podman; \
echo -e "podman:1:999\npodman:1001:64535" > /etc/subuid; \
echo -e "podman:1:999\npodman:1001:64535" > /etc/subgid;

ADD /test/containers.conf /etc/containers/containers.conf
ADD /test/podman-containers.conf /home/podman/.config/containers/containers.conf

RUN mkdir -p /home/podman/.local/share/containers && \
    chown podman:podman -R /home/podman && \
    chmod 644 /etc/containers/containers.conf

# Copy & modify the defaults to provide reference if runtime changes needed.
# Changes here are required for running with fuse-overlay storage inside container.
RUN sed -e 's|^#mount_program|mount_program|g' \
           -e '/additionalimage.*/a "/var/lib/shared",' \
           -e 's|^mountopt[[:space:]]*=.*$|mountopt = "nodev,fsync=0"|g' \
           /usr/share/containers/storage.conf \
           > /etc/containers/storage.conf

# Setup internal Podman to pass subscriptions down from host to internal container
RUN printf '/run/secrets/etc-pki-entitlement:/run/secrets/etc-pki-entitlement\n/run/secrets/rhsm:/run/secrets/rhsm\n' > /etc/containers/mounts.conf

# Note VOLUME options must always happen after the chown call above
# RUN commands can not modify existing volumes
VOLUME /var/lib/containers
VOLUME /home/podman/.local/share/containers

RUN mkdir -p /var/lib/shared/overlay-images \
             /var/lib/shared/overlay-layers \
             /var/lib/shared/vfs-images \
             /var/lib/shared/vfs-layers && \
    touch /var/lib/shared/overlay-images/images.lock && \
    touch /var/lib/shared/overlay-layers/layers.lock && \
    touch /var/lib/shared/vfs-images/images.lock && \
    touch /var/lib/shared/vfs-layers/layers.lock

ENV _CONTAINERS_USERNS_CONFIGURED="" \
    BUILDAH_ISOLATION=chroot


# My additions to the podman official podman-in-podman image
# can be built and run with:
#   podman build -t podman-fedora-wdio -f ./test/podman-fedora-wdio.dockerfile .
#   podman run --rm -v ./:/home/podman/nice-node -u podman podman-fedora-wdio

RUN dnf install -y nodejs npm git zip dpkg fakeroot rpmdevtools sudo
RUN dnf install -y nss nss-tools libxcb xorg-x11-server-Xvfb dbus-devel atk-devel at-spi2-atk cups-libs gtk3-devel

RUN mkdir /home/podman/nice-node
WORKDIR /home/podman/nice-node


# Allow 'podman' user to run sudo without password (useful for manually installing packages)
RUN echo "podman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/podman
RUN echo "podman:password" | chpasswd

CMD ["bash", "-c", "npm install --loglevel=info && npm run package -- --arch=x64 && xvfb-run npm run wdio"]

# # Start the Xvfb server Is currently not needed
# export DISPLAY=':99.0'
# xvfb-run :99 -screen 0 1024x768x24 > /dev/null 2>&1 &



