import { isRejectedWithValue, isFulfilled } from "@reduxjs/toolkit";
import { notification } from "antd";

export const notificationMiddleware =
  (storeAPI: any) => (next: any) => (action: any) => {
    const fullState = storeAPI.getState();
    const [sliceName] = action.type.split("/");
    const sliceState = fullState[sliceName];
    
    if (isRejectedWithValue(action)) {
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : sliceState?.error || "Something went wrong";

      notification.open({
        type: "error",
        message: errorMessage,
        placement: "bottomRight",
        duration: 3,
        closable: false,
      });
    }

    if (isFulfilled(action)) {
      const successMessage = sliceState?.success || "Action performed successfully";
      notification.open({
        type: "success",
        message: successMessage,
        placement: "bottomRight",
        duration: 3,
        closable: false,
      });
    }

    return next(action);
  };
