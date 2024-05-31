const { ipcRenderer } = require('electron');

const getIconKey = (status) => {
  switch (status) {
    case 'running':
    case 'starting':
      return 'syncing';
    case 'notInstalled':
    case 'notRunning':
    case 'isOutdated':
      return 'error';
    default:
      return status;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'notInstalled':
      return 'Not Installed';
    case 'notRunning':
      return 'Not Running';
    case 'isOutdated':
      return 'Update Now';
    default:
      return status;
  }
};

ipcRenderer.on(
  'update-menu',
  (event, { nodePackageTrayMenu, podmanMenuItem, statusIcons }) => {
    const menuItems = [
      ...nodePackageTrayMenu.map((item) => ({
        name: item.name,
        status: item.status,
        action: () => ipcRenderer.send('node-package-click', item.id),
      })),
      { separator: true },
      ...(podmanMenuItem.status !== 'isRunning'
        ? [
            {
              name: 'Podman',
              status: podmanMenuItem.status,
              action: () => ipcRenderer.send('podman-click'),
            },
            { separator: true },
          ]
        : []),
      {
        name: 'Open NiceNode',
        action: () => ipcRenderer.send('show-main-window'),
      },
      { name: 'Quit', action: () => ipcRenderer.send('quit-app') },
    ];

    const container = document.getElementById('menu-container');
    container.innerHTML = ''; // Clear existing items

    menuItems.forEach((item) => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'separator';
        container.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';

        if (item.status === 'stopped') {
          menuItem.classList.add('stopped');
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        menuItem.appendChild(nameSpan);

        if (item.status) {
          const statusContainer = document.createElement('div');
          statusContainer.className = 'menu-status-container';

          const statusIconContainer = document.createElement('div');
          statusIconContainer.className = 'menu-status-icon';

          const statusIcon = document.createElement('div');
          statusIcon.innerHTML =
            statusIcons[getIconKey(item.status)] || statusIcons['default'];
          statusIcon.className = 'status-icon';

          const statusText = document.createElement('div');
          statusText.className = 'menu-status';
          statusText.textContent = getStatusText(item.status);

          statusIconContainer.appendChild(statusIcon);
          statusContainer.appendChild(statusIconContainer);
          statusContainer.appendChild(statusText);
          menuItem.appendChild(statusContainer);
        }

        menuItem.addEventListener('click', item.action);

        container.appendChild(menuItem);
      }
    });
    ipcRenderer.send('adjust-height', document.body.scrollHeight);
  },
);

ipcRenderer.on('set-theme', (event, theme) => {
  applyTheme(theme);
});

// Apply theme-based styles
const applyTheme = (theme) => {
  const body = document.body;
  const menuItems = document.querySelectorAll('.menu-item');
  if (theme === 'dark') {
    body.classList.add('dark');
    body.classList.remove('light');
  } else {
    body.classList.add('light');
    body.classList.remove('dark');
  }
};

ipcRenderer.on('update-menu', (event, updatedItems) => {
  // Update menu items if necessary
});
