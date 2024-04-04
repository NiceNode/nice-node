/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/messenger.ts":
/*!*******************************!*\
  !*** ./src/main/messenger.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHANNELS_ARRAY = exports.CHANNELS = exports.send = exports.setWindow = void 0;
// import logger from './logger';
let mainWindow;
const setWindow = (inMainWindow) => {
    mainWindow = inMainWindow;
};
exports.setWindow = setWindow;
// eslint-disable-next-line
const send = (channel, ...args) => {
    if (!mainWindow) {
        return;
    }
    // console.log('sending', channel, args);
    mainWindow.webContents.send(channel, args);
};
exports.send = send;
exports.CHANNELS = {
    userNodes: 'userNodes',
    userNodePackages: 'userNodePackages',
    nodeLogs: 'nodeLogs',
    podman: 'podman',
    podmanInstall: 'podmanInstall',
    theme: 'theme',
    notifications: 'notifications',
    reportEvent: 'reportEvent',
};
exports.CHANNELS_ARRAY = Object.keys(exports.CHANNELS);


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const messenger_1 = __webpack_require__(/*! ./messenger */ "./src/main/messenger.ts");
// todo: when moving from require to imports
// const isTest = process.env.NODE_ENV === 'test';
// if (isTest) {
//   console.log('NODE_ENV=TEST... requiring wdio-electron-service/main');
//   require('wdio-electron-service/preload');
// }
electron_1.contextBridge.exposeInMainWorld('electron', {
    SENTRY_DSN: process.env.SENTRY_DSN,
    ipcRenderer: {
        // eslint-disable-next-line
        on(channel, func) {
            const validChannels = messenger_1.CHANNELS_ARRAY;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                electron_1.ipcRenderer.on(channel, (_event, ...args) => func(...args));
            }
            else {
                console.error('IPC message not on a valid channel!');
            }
        },
        removeListener(channel, listener) {
            electron_1.ipcRenderer.removeListener(channel, listener);
            console.log(`Removed ${channel} channel listener.`);
        },
        removeAllListeners(channel) {
            electron_1.ipcRenderer.removeAllListeners(channel);
            console.log(`Removed all listeners on ${channel} channel.`);
        },
    },
    updateNodeLastSyncedBlock: (nodeId, block) => electron_1.ipcRenderer.invoke('updateNodeLastSyncedBlock', nodeId, block),
    getSystemFreeDiskSpace: () => electron_1.ipcRenderer.invoke('getSystemFreeDiskSpace'),
    getSystemDiskSize: () => electron_1.ipcRenderer.invoke('getSystemDiskSize'),
    getDebugInfo: () => electron_1.ipcRenderer.invoke('getDebugInfo'),
    getStoreValue: (key) => electron_1.ipcRenderer.invoke('getStoreValue', key),
    // eslint-disable-next-line
    setStoreValue: (key, value) => electron_1.ipcRenderer.invoke('setStoreValue', key, value),
    getGethLogs: () => electron_1.ipcRenderer.invoke('getGethLogs'),
    getGethErrorLogs: () => electron_1.ipcRenderer.invoke('getGethErrorLogs'),
    getMainProcessUsage: () => electron_1.ipcRenderer.invoke('getMainProcessUsage'),
    getRendererProcessUsage: async () => {
        const memory = await process.getProcessMemoryInfo();
        const cpu = await process.getCPUUsage();
        return { memory, cpu };
    },
    checkSystemHardware: () => electron_1.ipcRenderer.invoke('checkSystemHardware'),
    getSystemInfo: () => electron_1.ipcRenderer.invoke('getSystemInfo'),
    getBenchmarks: () => electron_1.ipcRenderer.invoke('getBenchmarks'),
    runBenchmark: () => electron_1.ipcRenderer.invoke('runBenchmark'),
    getFailSystemRequirements: () => electron_1.ipcRenderer.invoke('getFailSystemRequirements'),
    closeApp: () => electron_1.ipcRenderer.invoke('closeApp'),
    // Multi-node
    getNodes: () => electron_1.ipcRenderer.invoke('getNodes'),
    getUserNodes: () => electron_1.ipcRenderer.invoke('getUserNodes'),
    getUserNodePackages: () => electron_1.ipcRenderer.invoke('getUserNodePackages'),
    startNodePackage: (nodeId) => {
        electron_1.ipcRenderer.invoke('startNodePackage', nodeId);
    },
    stopNodePackage: (nodeId) => {
        electron_1.ipcRenderer.invoke('stopNodePackage', nodeId);
    },
    removeNodePackage: (nodeId, options) => electron_1.ipcRenderer.invoke('removeNodePackage', nodeId, options),
    addNodePackage: async (nodeSpec, services, settings) => {
        return electron_1.ipcRenderer.invoke('addNodePackage', nodeSpec, services, settings);
    },
    addNode: (nodeSpec, storageLocation) => electron_1.ipcRenderer.invoke('addNode', nodeSpec, storageLocation),
    updateNode: (nodeId, propertiesToUpdate) => electron_1.ipcRenderer.invoke('updateNode', nodeId, propertiesToUpdate),
    removeNode: (nodeId, options) => electron_1.ipcRenderer.invoke('removeNode', nodeId, options),
    startNode: (nodeId) => {
        electron_1.ipcRenderer.invoke('startNode', nodeId);
    },
    getNodeStartCommand: (nodeId) => {
        return electron_1.ipcRenderer.invoke('getNodeStartCommand', nodeId);
    },
    stopNode: (nodeId) => {
        electron_1.ipcRenderer.invoke('stopNode', nodeId);
    },
    updateNodeDataDir: (node, newDataDir) => electron_1.ipcRenderer.invoke('updateNodeDataDir', node, newDataDir),
    openDialogForNodeDataDir: (nodeId) => electron_1.ipcRenderer.invoke('openDialogForNodeDataDir', nodeId),
    openDialogForStorageLocation: () => electron_1.ipcRenderer.invoke('openDialogForStorageLocation'),
    deleteNodeStorage: (nodeId) => electron_1.ipcRenderer.invoke('deleteNodeStorage', nodeId),
    resetNodeConfig: (nodeId) => electron_1.ipcRenderer.invoke('resetNodeConfig', nodeId),
    sendNodeLogs: (nodeId) => {
        electron_1.ipcRenderer.invoke('sendNodeLogs', nodeId);
    },
    stopSendingNodeLogs: (nodeId) => {
        electron_1.ipcRenderer.invoke('stopSendingNodeLogs', nodeId);
    },
    // Default Node storage location
    getNodesDefaultStorageLocation: () => electron_1.ipcRenderer.invoke('getNodesDefaultStorageLocation'),
    // Node library
    getNodeLibrary: () => electron_1.ipcRenderer.invoke('getNodeLibrary'),
    getNodePackageLibrary: () => electron_1.ipcRenderer.invoke('getNodePackageLibrary'),
    // Podman
    getIsPodmanInstalled: () => electron_1.ipcRenderer.invoke('getIsPodmanInstalled'),
    installPodman: () => electron_1.ipcRenderer.invoke('installPodman'),
    getIsPodmanRunning: () => electron_1.ipcRenderer.invoke('getIsPodmanRunning'),
    getPodmanDetails: () => electron_1.ipcRenderer.invoke('getPodmanDetails'),
    startPodman: () => electron_1.ipcRenderer.invoke('startPodman'),
    updatePodman: () => electron_1.ipcRenderer.invoke('updatePodman'),
    // Settings
    getSetHasSeenSplashscreen: (hasSeen) => electron_1.ipcRenderer.invoke('getSetHasSeenSplashscreen', hasSeen),
    getSetHasSeenAlphaModal: (hasSeen) => electron_1.ipcRenderer.invoke('getSetHasSeenAlphaModal', hasSeen),
    getSettings: () => electron_1.ipcRenderer.invoke('getSettings'),
    getAppClientId: () => electron_1.ipcRenderer.invoke('getAppClientId'),
    setLanguage: (languageCode) => {
        electron_1.ipcRenderer.invoke('setLanguage', languageCode);
    },
    setNativeThemeSetting: (theme) => {
        electron_1.ipcRenderer.invoke('setNativeThemeSetting', theme);
    },
    setThemeSetting: (theme) => {
        electron_1.ipcRenderer.invoke('setThemeSetting', theme);
    },
    setIsOpenOnStartup: (isOpenOnStartup) => {
        electron_1.ipcRenderer.invoke('setIsOpenOnStartup', isOpenOnStartup);
    },
    getSetIsNotificationsEnabled: (isNotificationsEnabled) => {
        electron_1.ipcRenderer.invoke('getSetIsNotificationsEnabled', isNotificationsEnabled);
    },
    setIsEventReportingEnabled: (isEventReportingEnabled) => {
        electron_1.ipcRenderer.invoke('setIsEventReportingEnabled', isEventReportingEnabled);
    },
    getSetIsPreReleaseUpdatesEnabled: (isPreReleaseUpdatesEnabled) => {
        electron_1.ipcRenderer.invoke('getSetIsPreReleaseUpdatesEnabled', isPreReleaseUpdatesEnabled);
    },
    // Notifications
    getNotifications: () => electron_1.ipcRenderer.invoke('getNotifications'),
    addNotification: (notification) => {
        electron_1.ipcRenderer.invoke('addNotification', notification);
    },
    removeNotifications: () => electron_1.ipcRenderer.invoke('removeNotifications'),
    markAllAsRead: () => electron_1.ipcRenderer.invoke('markAllAsRead'),
    // Ports
    checkPorts: (ports) => {
        electron_1.ipcRenderer.invoke('checkPorts', ports);
    },
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxDQUFDLDRCQUE0QixFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNELGdDQUFnQyxFQUFFLENBQUMsMEJBQW9DLEVBQUUsRUFBRTtRQUN6RSxzQkFBVyxDQUFDLE1BQU0sQ0FDaEIsa0NBQWtDLEVBQ2xDLDBCQUEwQixDQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVELGdCQUFnQjtJQUNoQixnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztJQUM5RCxlQUFlLEVBQUUsQ0FBQyxZQUEwQixFQUFFLEVBQUU7UUFDOUMsc0JBQVcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFXLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BFLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFeEQsUUFBUTtJQUNSLFVBQVUsRUFBRSxDQUFDLEtBQWUsRUFBRSxFQUFFO1FBQzlCLHNCQUFXLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmljZS1ub2RlLy4vc3JjL21haW4vbWVzc2VuZ2VyLnRzIiwid2VicGFjazovL25pY2Utbm9kZS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9uaWNlLW5vZGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbmljZS1ub2RlLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xuXG4vLyBpbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxubGV0IG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3c7XG5cbmV4cG9ydCBjb25zdCBzZXRXaW5kb3cgPSAoaW5NYWluV2luZG93OiBCcm93c2VyV2luZG93KTogdm9pZCA9PiB7XG4gIG1haW5XaW5kb3cgPSBpbk1haW5XaW5kb3c7XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBzZW5kID0gKGNoYW5uZWw6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkID0+IHtcbiAgaWYgKCFtYWluV2luZG93KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdzZW5kaW5nJywgY2hhbm5lbCwgYXJncyk7XG4gIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChjaGFubmVsLCBhcmdzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBDSEFOTkVMUyA9IHtcbiAgdXNlck5vZGVzOiAndXNlck5vZGVzJyxcbiAgdXNlck5vZGVQYWNrYWdlczogJ3VzZXJOb2RlUGFja2FnZXMnLFxuICBub2RlTG9nczogJ25vZGVMb2dzJyxcbiAgcG9kbWFuOiAncG9kbWFuJyxcbiAgcG9kbWFuSW5zdGFsbDogJ3BvZG1hbkluc3RhbGwnLFxuICB0aGVtZTogJ3RoZW1lJyxcbiAgbm90aWZpY2F0aW9uczogJ25vdGlmaWNhdGlvbnMnLFxuICByZXBvcnRFdmVudDogJ3JlcG9ydEV2ZW50Jyxcbn07XG5leHBvcnQgY29uc3QgQ0hBTk5FTFNfQVJSQVkgPSBPYmplY3Qua2V5cyhDSEFOTkVMUyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCB7XG4gIE5vZGVQYWNrYWdlU3BlY2lmaWNhdGlvbixcbiAgTm9kZVNwZWNpZmljYXRpb24sXG59IGZyb20gJy4uL2NvbW1vbi9ub2RlU3BlYyc7XG5pbXBvcnQgeyBDSEFOTkVMU19BUlJBWSB9IGZyb20gJy4vbWVzc2VuZ2VyJztcbmltcG9ydCB7IE5vZGVJZCB9IGZyb20gJy4uL2NvbW1vbi9ub2RlJztcbmltcG9ydCB7IFRoZW1lU2V0dGluZyB9IGZyb20gJy4vc3RhdGUvc2V0dGluZ3MnO1xuaW1wb3J0IHsgQWRkTm9kZVBhY2thZ2VOb2RlU2VydmljZSB9IGZyb20gJy4vbm9kZVBhY2thZ2VNYW5hZ2VyJztcbmltcG9ydCB7IENvbmZpZ1ZhbHVlc01hcCB9IGZyb20gJy4uL2NvbW1vbi9ub2RlQ29uZmlnJztcblxuLy8gdG9kbzogd2hlbiBtb3ZpbmcgZnJvbSByZXF1aXJlIHRvIGltcG9ydHNcbi8vIGNvbnN0IGlzVGVzdCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCc7XG4vLyBpZiAoaXNUZXN0KSB7XG4vLyAgIGNvbnNvbGUubG9nKCdOT0RFX0VOVj1URVNULi4uIHJlcXVpcmluZyB3ZGlvLWVsZWN0cm9uLXNlcnZpY2UvbWFpbicpO1xuLy8gICByZXF1aXJlKCd3ZGlvLWVsZWN0cm9uLXNlcnZpY2UvcHJlbG9hZCcpO1xuLy8gfVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIHtcbiAgU0VOVFJZX0RTTjogcHJvY2Vzcy5lbnYuU0VOVFJZX0RTTixcbiAgaXBjUmVuZGVyZXI6IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBvbihjaGFubmVsOiBzdHJpbmcsIGZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkge1xuICAgICAgY29uc3QgdmFsaWRDaGFubmVscyA9IENIQU5ORUxTX0FSUkFZO1xuICAgICAgaWYgKHZhbGlkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCkpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IHN0cmlwIGV2ZW50IGFzIGl0IGluY2x1ZGVzIGBzZW5kZXJgXG4gICAgICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIChfZXZlbnQsIC4uLmFyZ3MpID0+IGZ1bmMoLi4uYXJncykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSVBDIG1lc3NhZ2Ugbm90IG9uIGEgdmFsaWQgY2hhbm5lbCEnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWw6IHN0cmluZywgbGlzdGVuZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkge1xuICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgbGlzdGVuZXIpO1xuICAgICAgY29uc29sZS5sb2coYFJlbW92ZWQgJHtjaGFubmVsfSBjaGFubmVsIGxpc3RlbmVyLmApO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGNoYW5uZWw6IHN0cmluZykge1xuICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlQWxsTGlzdGVuZXJzKGNoYW5uZWwpO1xuICAgICAgY29uc29sZS5sb2coYFJlbW92ZWQgYWxsIGxpc3RlbmVycyBvbiAke2NoYW5uZWx9IGNoYW5uZWwuYCk7XG4gICAgfSxcbiAgfSxcbiAgdXBkYXRlTm9kZUxhc3RTeW5jZWRCbG9jazogKG5vZGVJZDogTm9kZUlkLCBibG9jazogbnVtYmVyKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgndXBkYXRlTm9kZUxhc3RTeW5jZWRCbG9jaycsIG5vZGVJZCwgYmxvY2spLFxuICBnZXRTeXN0ZW1GcmVlRGlza1NwYWNlOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldFN5c3RlbUZyZWVEaXNrU3BhY2UnKSxcbiAgZ2V0U3lzdGVtRGlza1NpemU6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0U3lzdGVtRGlza1NpemUnKSxcbiAgZ2V0RGVidWdJbmZvOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldERlYnVnSW5mbycpLFxuICBnZXRTdG9yZVZhbHVlOiAoa2V5OiBzdHJpbmcpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0U3RvcmVWYWx1ZScsIGtleSksXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICBzZXRTdG9yZVZhbHVlOiAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzZXRTdG9yZVZhbHVlJywga2V5LCB2YWx1ZSksXG4gIGdldEdldGhMb2dzOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldEdldGhMb2dzJyksXG4gIGdldEdldGhFcnJvckxvZ3M6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0R2V0aEVycm9yTG9ncycpLFxuICBnZXRNYWluUHJvY2Vzc1VzYWdlOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldE1haW5Qcm9jZXNzVXNhZ2UnKSxcbiAgZ2V0UmVuZGVyZXJQcm9jZXNzVXNhZ2U6IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtZW1vcnkgPSBhd2FpdCBwcm9jZXNzLmdldFByb2Nlc3NNZW1vcnlJbmZvKCk7XG4gICAgY29uc3QgY3B1ID0gYXdhaXQgcHJvY2Vzcy5nZXRDUFVVc2FnZSgpO1xuICAgIHJldHVybiB7IG1lbW9yeSwgY3B1IH07XG4gIH0sXG4gIGNoZWNrU3lzdGVtSGFyZHdhcmU6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnY2hlY2tTeXN0ZW1IYXJkd2FyZScpLFxuICBnZXRTeXN0ZW1JbmZvOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldFN5c3RlbUluZm8nKSxcbiAgZ2V0QmVuY2htYXJrczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRCZW5jaG1hcmtzJyksXG4gIHJ1bkJlbmNobWFyazogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdydW5CZW5jaG1hcmsnKSxcblxuICBnZXRGYWlsU3lzdGVtUmVxdWlyZW1lbnRzOiAoKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0RmFpbFN5c3RlbVJlcXVpcmVtZW50cycpLFxuICBjbG9zZUFwcDogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdjbG9zZUFwcCcpLFxuXG4gIC8vIE11bHRpLW5vZGVcbiAgZ2V0Tm9kZXM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0Tm9kZXMnKSxcbiAgZ2V0VXNlck5vZGVzOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldFVzZXJOb2RlcycpLFxuICBnZXRVc2VyTm9kZVBhY2thZ2VzOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldFVzZXJOb2RlUGFja2FnZXMnKSxcbiAgc3RhcnROb2RlUGFja2FnZTogKG5vZGVJZDogTm9kZUlkKSA9PiB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzdGFydE5vZGVQYWNrYWdlJywgbm9kZUlkKTtcbiAgfSxcbiAgc3RvcE5vZGVQYWNrYWdlOiAobm9kZUlkOiBOb2RlSWQpID0+IHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3N0b3BOb2RlUGFja2FnZScsIG5vZGVJZCk7XG4gIH0sXG4gIHJlbW92ZU5vZGVQYWNrYWdlOiAobm9kZUlkOiBOb2RlSWQsIG9wdGlvbnM6IHsgaXNEZWxldGVTdG9yYWdlOiBib29sZWFuIH0pID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdyZW1vdmVOb2RlUGFja2FnZScsIG5vZGVJZCwgb3B0aW9ucyksXG4gIGFkZE5vZGVQYWNrYWdlOiBhc3luYyAoXG4gICAgbm9kZVNwZWM6IE5vZGVQYWNrYWdlU3BlY2lmaWNhdGlvbixcbiAgICBzZXJ2aWNlczogQWRkTm9kZVBhY2thZ2VOb2RlU2VydmljZVtdLFxuICAgIHNldHRpbmdzOiB7IHN0b3JhZ2VMb2NhdGlvbj86IHN0cmluZzsgY29uZmlnVmFsdWVzPzogQ29uZmlnVmFsdWVzTWFwIH0sXG4gICkgPT4ge1xuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoJ2FkZE5vZGVQYWNrYWdlJywgbm9kZVNwZWMsIHNlcnZpY2VzLCBzZXR0aW5ncyk7XG4gIH0sXG4gIGFkZE5vZGU6IChub2RlU3BlYzogTm9kZVNwZWNpZmljYXRpb24sIHN0b3JhZ2VMb2NhdGlvbj86IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2FkZE5vZGUnLCBub2RlU3BlYywgc3RvcmFnZUxvY2F0aW9uKSxcbiAgdXBkYXRlTm9kZTogKG5vZGVJZDogTm9kZUlkLCBwcm9wZXJ0aWVzVG9VcGRhdGU6IGFueSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3VwZGF0ZU5vZGUnLCBub2RlSWQsIHByb3BlcnRpZXNUb1VwZGF0ZSksXG5cbiAgcmVtb3ZlTm9kZTogKG5vZGVJZDogTm9kZUlkLCBvcHRpb25zOiB7IGlzRGVsZXRlU3RvcmFnZTogYm9vbGVhbiB9KSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgncmVtb3ZlTm9kZScsIG5vZGVJZCwgb3B0aW9ucyksXG4gIHN0YXJ0Tm9kZTogKG5vZGVJZDogTm9kZUlkKSA9PiB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzdGFydE5vZGUnLCBub2RlSWQpO1xuICB9LFxuICBnZXROb2RlU3RhcnRDb21tYW5kOiAobm9kZUlkOiBOb2RlSWQpID0+IHtcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXROb2RlU3RhcnRDb21tYW5kJywgbm9kZUlkKTtcbiAgfSxcbiAgc3RvcE5vZGU6IChub2RlSWQ6IE5vZGVJZCkgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc3RvcE5vZGUnLCBub2RlSWQpO1xuICB9LFxuICB1cGRhdGVOb2RlRGF0YURpcjogKG5vZGU6IE5vZGUsIG5ld0RhdGFEaXI6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3VwZGF0ZU5vZGVEYXRhRGlyJywgbm9kZSwgbmV3RGF0YURpciksXG4gIG9wZW5EaWFsb2dGb3JOb2RlRGF0YURpcjogKG5vZGVJZDogTm9kZUlkKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnb3BlbkRpYWxvZ0Zvck5vZGVEYXRhRGlyJywgbm9kZUlkKSxcbiAgb3BlbkRpYWxvZ0ZvclN0b3JhZ2VMb2NhdGlvbjogKCkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ29wZW5EaWFsb2dGb3JTdG9yYWdlTG9jYXRpb24nKSxcbiAgZGVsZXRlTm9kZVN0b3JhZ2U6IChub2RlSWQ6IE5vZGVJZCkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2RlbGV0ZU5vZGVTdG9yYWdlJywgbm9kZUlkKSxcbiAgcmVzZXROb2RlQ29uZmlnOiAobm9kZUlkOiBOb2RlSWQpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdyZXNldE5vZGVDb25maWcnLCBub2RlSWQpLFxuICBzZW5kTm9kZUxvZ3M6IChub2RlSWQ6IE5vZGVJZCkgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc2VuZE5vZGVMb2dzJywgbm9kZUlkKTtcbiAgfSxcbiAgc3RvcFNlbmRpbmdOb2RlTG9nczogKG5vZGVJZD86IE5vZGVJZCkgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc3RvcFNlbmRpbmdOb2RlTG9ncycsIG5vZGVJZCk7XG4gIH0sXG5cbiAgLy8gRGVmYXVsdCBOb2RlIHN0b3JhZ2UgbG9jYXRpb25cbiAgZ2V0Tm9kZXNEZWZhdWx0U3RvcmFnZUxvY2F0aW9uOiAoKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0Tm9kZXNEZWZhdWx0U3RvcmFnZUxvY2F0aW9uJyksXG5cbiAgLy8gTm9kZSBsaWJyYXJ5XG4gIGdldE5vZGVMaWJyYXJ5OiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2dldE5vZGVMaWJyYXJ5JyksXG4gIGdldE5vZGVQYWNrYWdlTGlicmFyeTogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXROb2RlUGFja2FnZUxpYnJhcnknKSxcblxuICAvLyBQb2RtYW5cbiAgZ2V0SXNQb2RtYW5JbnN0YWxsZWQ6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0SXNQb2RtYW5JbnN0YWxsZWQnKSxcbiAgaW5zdGFsbFBvZG1hbjogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdpbnN0YWxsUG9kbWFuJyksXG4gIGdldElzUG9kbWFuUnVubmluZzogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRJc1BvZG1hblJ1bm5pbmcnKSxcbiAgZ2V0UG9kbWFuRGV0YWlsczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRQb2RtYW5EZXRhaWxzJyksXG4gIHN0YXJ0UG9kbWFuOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ3N0YXJ0UG9kbWFuJyksXG4gIHVwZGF0ZVBvZG1hbjogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCd1cGRhdGVQb2RtYW4nKSxcblxuICAvLyBTZXR0aW5nc1xuICBnZXRTZXRIYXNTZWVuU3BsYXNoc2NyZWVuOiAoaGFzU2Vlbj86IGJvb2xlYW4pID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRTZXRIYXNTZWVuU3BsYXNoc2NyZWVuJywgaGFzU2VlbiksXG4gIGdldFNldEhhc1NlZW5BbHBoYU1vZGFsOiAoaGFzU2Vlbj86IGJvb2xlYW4pID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRTZXRIYXNTZWVuQWxwaGFNb2RhbCcsIGhhc1NlZW4pLFxuICBnZXRTZXR0aW5nczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRTZXR0aW5ncycpLFxuICBnZXRBcHBDbGllbnRJZDogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdnZXRBcHBDbGllbnRJZCcpLFxuICBzZXRMYW5ndWFnZTogKGxhbmd1YWdlQ29kZTogc3RyaW5nKSA9PiB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzZXRMYW5ndWFnZScsIGxhbmd1YWdlQ29kZSk7XG4gIH0sXG4gIHNldE5hdGl2ZVRoZW1lU2V0dGluZzogKHRoZW1lOiBUaGVtZVNldHRpbmcpID0+IHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3NldE5hdGl2ZVRoZW1lU2V0dGluZycsIHRoZW1lKTtcbiAgfSxcbiAgc2V0VGhlbWVTZXR0aW5nOiAodGhlbWU6IFRoZW1lU2V0dGluZykgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc2V0VGhlbWVTZXR0aW5nJywgdGhlbWUpO1xuICB9LFxuICBzZXRJc09wZW5PblN0YXJ0dXA6IChpc09wZW5PblN0YXJ0dXA6IGJvb2xlYW4pID0+IHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3NldElzT3Blbk9uU3RhcnR1cCcsIGlzT3Blbk9uU3RhcnR1cCk7XG4gIH0sXG4gIGdldFNldElzTm90aWZpY2F0aW9uc0VuYWJsZWQ6IChpc05vdGlmaWNhdGlvbnNFbmFibGVkPzogYm9vbGVhbikgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0U2V0SXNOb3RpZmljYXRpb25zRW5hYmxlZCcsIGlzTm90aWZpY2F0aW9uc0VuYWJsZWQpO1xuICB9LFxuICBzZXRJc0V2ZW50UmVwb3J0aW5nRW5hYmxlZDogKGlzRXZlbnRSZXBvcnRpbmdFbmFibGVkOiBib29sZWFuKSA9PiB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzZXRJc0V2ZW50UmVwb3J0aW5nRW5hYmxlZCcsIGlzRXZlbnRSZXBvcnRpbmdFbmFibGVkKTtcbiAgfSxcbiAgZ2V0U2V0SXNQcmVSZWxlYXNlVXBkYXRlc0VuYWJsZWQ6IChpc1ByZVJlbGVhc2VVcGRhdGVzRW5hYmxlZD86IGJvb2xlYW4pID0+IHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoXG4gICAgICAnZ2V0U2V0SXNQcmVSZWxlYXNlVXBkYXRlc0VuYWJsZWQnLFxuICAgICAgaXNQcmVSZWxlYXNlVXBkYXRlc0VuYWJsZWQsXG4gICAgKTtcbiAgfSxcblxuICAvLyBOb3RpZmljYXRpb25zXG4gIGdldE5vdGlmaWNhdGlvbnM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZ2V0Tm90aWZpY2F0aW9ucycpLFxuICBhZGROb3RpZmljYXRpb246IChub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbikgPT4ge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnYWRkTm90aWZpY2F0aW9uJywgbm90aWZpY2F0aW9uKTtcbiAgfSxcbiAgcmVtb3ZlTm90aWZpY2F0aW9uczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdyZW1vdmVOb3RpZmljYXRpb25zJyksXG4gIG1hcmtBbGxBc1JlYWQ6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbWFya0FsbEFzUmVhZCcpLFxuXG4gIC8vIFBvcnRzXG4gIGNoZWNrUG9ydHM6IChwb3J0czogbnVtYmVyW10pID0+IHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2NoZWNrUG9ydHMnLCBwb3J0cyk7XG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==