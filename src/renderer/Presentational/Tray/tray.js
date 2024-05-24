const { ipcRenderer } = require('electron');

ipcRenderer.on(
  'update-menu',
  (event, { nodePackageTrayMenu, podmanMenuItem }) => {
    const menuItems = [
      ...nodePackageTrayMenu.map((item) => ({
        name: item.name,
        status: item.status,
        action: () => ipcRenderer.send('node-package-click', item.id),
      })),
      { separator: true },
      {
        name: 'Podman',
        status: podmanMenuItem.status,
        action: () => ipcRenderer.send('podman-click'),
      },
      { separator: true },
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

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        menuItem.appendChild(nameSpan);

        if (item.status) {
          const statusSpan = document.createElement('span');
          statusSpan.textContent = item.status;
          menuItem.appendChild(statusSpan);
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
    body.style.color = 'white';
  } else {
    body.style.color = 'black';
  }
};

ipcRenderer.on('update-menu', (event, updatedItems) => {
  // Update menu items if necessary
});
