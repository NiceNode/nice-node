const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const menuItems = [
    { name: 'Ethereum', status: 'error stopping' },
    { name: 'Minecraft Server', status: 'error stopping' },
    { separator: true },
    { name: 'Podman', status: 'Running', checked: true },
    { separator: true },
    { name: 'Open NiceNode', action: 'show-main-window' },
    { name: 'Quit', action: 'quit-app' },
  ];

  const container = document.getElementById('menu-container');

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

      menuItem.addEventListener('click', () => {
        if (item.action) {
          ipcRenderer.send(item.action);
        }
      });

      container.appendChild(menuItem);
    }
  });

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
});
