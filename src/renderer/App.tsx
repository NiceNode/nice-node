import { useEffect, useState } from 'react';
import {
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import NotificationsWrapper from './Presentational/Notifications/NotificationsWrapper';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import { initialize as initializeIpcListeners } from './ipc';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import NNSplash from './Presentational/NNSplashScreen/NNSplashScreen';
import { dragWindowContainer } from './app.css';
import ThemeManager from './ThemeManager';
import { Modal } from './Generics/redesign/Modal/Modal';
import AddNodeStepper from './Presentational/AddNodeStepper/AddNodeStepper';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

// const MainScreen = () => {
//   return (
//       {sHasSeenSplashscreen === false ? (
//         <>
//           {!sHasClickedGetStarted && (
//             <NNSplash onClickGetStarted={onClickSplashGetStarted} />
//           )}
//         </>
//       ) : (
//         <>
//           <div className={dragWindowContainer} />
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               width: '100%',
//               height: '100%',
//             }}
//           >
//             <SidebarWrapper />
//             <div style={{ flex: 1, overflow: 'auto' }}>
//               <NodeScreen />
//               {/* <NotificationsWrapper /> */}
//             </div>
//           </div>

//           <DataRefresher />
//           {/* Todo: remove this when Modal Manager is created */}
//           // <Modal
//           //   title=""
//           //   isOpen={sIsModalOpenAddNode}
//           //   onClickCloseButton={() => setIsModalOpenAddNode(false)}
//           //   isFullScreen
//           // >
//           //   <AddNodeStepper
//           //     onChange={(newValue: 'done' | 'cancel') => {
//           //       console.log(newValue);
//           //       if (newValue === 'done' || newValue === 'cancel') {
//           //         setIsModalOpenAddNode(false);
//           //       }
//           //     }}
//           //   />
//           // </Modal>
//         </>
//       )}
//   );
// };

const NodeSetup = () => {
  console.log('node setup');
  return <div>Node setup screen here</div>;
};

const Home = () => {
  return (
    <>
      <div className={dragWindowContainer} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
        }}
      >
        <SidebarWrapper />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
        <DataRefresher />
      </div>
    </>
  );
};

const System = () => {
  return <div>System monitor screen here</div>;
};

export default function App() {
  const dispatch = useAppDispatch();
  const [sHasSeenSplashscreen, setHasSeenSplashscreen] = useState<boolean>();
  const [sHasClickedGetStarted, setHasClickedGetStarted] = useState<boolean>();
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>();

  // const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
  // console.log('isStartOnLogin: ', isStartOnLogin);
  // setIsOpenOnLogin(isStartOnLogin);

  useEffect(() => {
    const callAsync = async () => {
      const hasSeen = await electron.getSetHasSeenSplashscreen();
      setHasSeenSplashscreen(hasSeen ?? false);
    };
    callAsync();
  }, []);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
  }, [dispatch]);

  const onClickSplashGetStarted = () => {
    setHasSeenSplashscreen(true);
    electron.getSetHasSeenSplashscreen(true);
    setHasClickedGetStarted(true);
    setIsModalOpenAddNode(true);
  };

  // const onChangeOpenOnLogin = (openOnLogin: boolean) => {
  //   electron.setStoreValue('isStartOnLogin', openOnLogin);
  //   setIsOpenOnLogin(openOnLogin);
  // };
  if (sHasSeenSplashscreen === undefined) {
    console.log(
      'waiting for splash screen value to return... showing loading screen'
    );
    return <></>;
  }

  let initialPage = '/home/node';
  if (sHasSeenSplashscreen === false) {
    initialPage = '/setup';
    console.log('User has not seen the splash screen yet');
  }

  return (
    <ThemeManager>
      <MemoryRouter initialEntries={[initialPage]}>
        <Routes>
          <Route path="/">
            <Route index path="/setup" element={<NodeSetup />} />
            <Route path="/home" element={<Home />}>
              <Route path="/home/node" element={<NodeScreen />} />
              <Route
                path="/home/notification"
                element={<NotificationsWrapper />}
              />
              <Route path="/home/system" element={<System />} />
            </Route>

            {/* Using path="*"" means "match anything", so this route
            acts like a catch-all for URLs that we don't have explicit
            routes for. */}
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeManager>
  );
}
