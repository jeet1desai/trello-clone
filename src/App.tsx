import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { SuspenseLoader } from './components';
import router from './routes';
import { ConfigProvider } from 'antd';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <Provider store={store}>
      <PersistGate loading={<SuspenseLoader message="Loading Store..." />} persistor={persistor}>
        <Suspense fallback={<SuspenseLoader message="Loading Application..." />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
    </ConfigProvider>
  );
};

export default App;
