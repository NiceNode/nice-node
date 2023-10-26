#!/bin/bash
set -e

# Launch the application after installation
if which /opt/NiceNode/nice-node > /dev/null; then
    /opt/NiceNode/nice-node > /dev/null 2>&1 &
    disown
    echo "Successfully started NiceNode"
else
    echo "Error: nice-node not found at /opt/NiceNode/. Please ensure it was installed correctly." >&2
    exit 1
fi

# DEBHELPER#

exit 0

