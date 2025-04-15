import { isRejectedWithValue, isFulfilled } from "@reduxjs/toolkit";
import { openNotification } from "../../services/notificationService";

export const notificationMiddleware =
  (storeAPI: any) => (next: any) => (action: any) => {
    const result = next(action);

    const fullState = storeAPI.getState();
    const [sliceName] = action.type.split("/");
    const sliceState = fullState[sliceName];

    if (isRejectedWithValue(action)) {
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : sliceState?.error || "Something went wrong.";

      openNotification({
        type: "error",
        message: errorMessage,
        placement: "bottomRight",
        duration: 2,
      });
    }

    if (isFulfilled(action)) {
      const successMessage =
        typeof action.payload === "string"
          ? action.payload
          : sliceState?.success || "Action performed successfully.";
      openNotification({
        type: "success",
        message: successMessage,
        placement: "bottomRight",
        duration: 2,
      });
    }

    return result;
  };
