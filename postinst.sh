# Why this wont work
# https://superuser.com/a/825230

What you're trying to do cannot possibly work right.

.deb packages are not private to each user – they're all installed system-wide, which is why the 'logname' output shows "root" – therefore they must work identically for all users, and cannot have anyone's home directory hardcoded into the system-wide configuration files.

Remember that Linux is a multi-user operating system – there can be multiple user accounts created, and even logged in at the same time. So if your package does this, then it'll only work for whoever installs it, but will become impossible to use for everyone else on that computer!

The difference between dpkg and Software Center here is that the former performs all actions and runs scripts directly, so the postinst scripts are still running within the user's login session. However, the Software Center delegates actual installation to a background service which runs "outside" any login sessions, and doesn't interact with users in any way.

#!/bin/bash

set -e

LOG_FILE="/var/log/nice-node-postinst.log"

exec > >(tee -a "$LOG_FILE") 2>&1

case "$1" in
    configure)
        logname
        w
        echo "starting nicenode in 2 seconds"
        sleep 2
        echo "is /opt/NiceNode/nice-node there? "
        if [ -d "/opt/NiceNode" ]; then
            echo "/opt/NiceNode exists"
        else
            echo "/opt/NiceNode does not exist"
        fi
        user=$(logname)
        if [ -n "$user" ]; then
            echo "$user"
        else
            echo "No logged in user detected"
        fi

        # sudo -u $user /opt/NiceNode/nice-node
        # Start the application in the background and redirect output to /dev/null
        # nohup sudo -u $user /opt/NiceNode/nice-node > /dev/null 2>&1 &
        /opt/NiceNode/nice-node > /dev/null 2>&1 &
        echo "stared with nohup, now disowning"
        # disown
        # echo "after disowned"
        ;;
    abort-upgrade|abort-remove|abort-deconfigure)
        ;;
    *)
        echo "postinst called with unknown argument \`$1'" >&2
        exit 0
        ;;
esac

# DEBHELPER#

exit 0



# set -e

# # Launch the application after installation
# if which /opt/NiceNode/nice-node > /dev/null; then
#   echo "Starting NiceNode in 3 seconds..."
#   sleep 3
#   nohup /opt/NiceNode/nice-node > /dev/null 2>&1 &
#   disown
#   echo "Successfully started NiceNode"
# else
#   echo "Error: nice-node not found at /opt/NiceNode/. Please ensure it was installed correctly." >&2
#   exit 1
# fi

# exit 0



