import { configureStore, combineReducers, Action } from "@reduxjs/toolkit";
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
import taskCommentReducer from "./slices/taskCommentSlice";
import taskAttachmentReducer from "./slices/taskAttachmentSlice";
import { notificationMiddleware } from "./middleware/notificationMiddleware";
import { RESET_APP } from "../config";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "profile", "workspace", "board", "status", "task"],
};

const appReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  workspace: workspaceReducer,
  board: boardReducer,
  status: statusReducer,
  task: taskReducer,
  taskComment: taskCommentReducer,
  taskAttachment: taskAttachmentReducer,
});

const rootReducer = (
  state: RootState | undefined,
  action: Action
): RootState => {
  if (action.type === RESET_APP) {
    state = undefined;
    storage.removeItem("persist:root");
  }
  return appReducer(state, action);
};

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

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
