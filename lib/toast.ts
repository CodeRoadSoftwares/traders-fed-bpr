import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(promise, messages);
  },
};
