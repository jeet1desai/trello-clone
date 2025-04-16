import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import profileReducer from "./slices/profileSlice";
import workspaceReducer from "./slices/workspaceSlice";
import boardReducer from "./slices/boardSlice";
import statusReducer from "./slices/statusSlice";
import taskReducer from "./slices/taskSlice";
import { notificationMiddleware } from "./middleware/notificationMiddleware";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "profile", "workspace", "board", "status", "task"],
};

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  workspace: workspaceReducer,
  board: boardReducer,
  status: statusReducer,
  task: taskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(notificationMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
