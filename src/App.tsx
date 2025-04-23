import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { SuspenseLoader } from "./components";
import router from "./routes";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import "./App.css";
import "./layout/styles/Theme.css";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SocketProvider } from "./contexts/SocketContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

// Wrapper component to use the theme hook
const ThemedApp: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const isDarkMode = currentTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 4,
        },
      }}
    >
      <AntdApp>
        <Suspense
          fallback={<SuspenseLoader message="Loading Application..." />}
        >
          <RouterProvider router={router} />
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<SuspenseLoader message="Loading Store..." />}
        persistor={persistor}
      >
        <ThemeProvider>
          <NotificationProvider>
            <SocketProvider url={process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'}>
              <ThemedApp />
            </SocketProvider>
          </NotificationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
