interface ToastItem {
  type: "normal" | "info" | "error";
  title: string;
  content: string;
}

function Toast() {}

export function ToastContainer() {}
