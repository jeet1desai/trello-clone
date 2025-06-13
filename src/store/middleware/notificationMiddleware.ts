import React from 'react';
import {
  Dispatch,
  Middleware,
  MiddlewareAPI,
  UnknownAction,
  isFulfilled,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { openNotification } from "../../services/notificationService";

const createClickableLink = (message: string) => {
  const parts = message.split("\nLink: ");
  if (parts.length === 2) {
    return React.createElement('div', null, [
      React.createElement('div', null, parts[0]),
      React.createElement('a', {
        href: parts[1],
        target: '_blank',
        rel: 'noopener noreferrer',
        style: { color: '#1890ff' }
      }, parts[1])
    ]);
  }
  return message;
};

export const notificationMiddleware: Middleware<
  {},
  RootState,
  Dispatch<UnknownAction>
> =
  (storeAPI: MiddlewareAPI<Dispatch<UnknownAction>, RootState>) =>
  (next: any) =>
  (action: any) => {
    const result = next(action);

    const fullState = storeAPI.getState();
    const [sliceName] = action.type.split("/");
    const sliceState = fullState[sliceName as keyof RootState];

    if (isRejectedWithValue(action)) {
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : sliceState?.error ?? "Something went wrong.";

      openNotification({
        type: "error",
        message: createClickableLink(errorMessage),
        placement: "bottomRight",
        duration: 2,
      });
    }

    if (isFulfilled(action)) {
      if (
        sliceName.includes("status") ||
        sliceName.includes("task") ||
        sliceName.includes("notification") ||
        sliceName.includes("dashboard") ||
        sliceName.includes("user")
      )
        return;

      const successMessage =
        typeof action.payload === "string"
          ? action.payload
          : sliceState?.success;

      if (successMessage)
        openNotification({
          type: "success",
          message: successMessage,
          placement: "bottomRight",
          duration: 2,
        });
    }

    return result;
  };
