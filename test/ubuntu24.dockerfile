FROM ubuntu:24.04

RUN apt-get update -qq

RUN  apt-get install --no-install-recommends -y nodejs npm git zip dpkg fakeroot rpm libarchive-tools
RUN  apt-get install -y \
      xvfb \
      zip \
      wget \
      ca-certificates \
      libnss3-dev \
      libasound2t64 \
      libxss1 \
      libappindicator3-1 \
      libindicator7 \
      xdg-utils \
      fonts-liberation \
      libgbm1

