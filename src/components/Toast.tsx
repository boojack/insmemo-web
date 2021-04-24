interface ToastItem {
  type: "normal" | "info" | "error";
  title: string;
  content: string;
}

export function Toast() {}
