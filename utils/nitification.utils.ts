import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function success(text:string='Successfully your action is achieved!') {
  toast.success(text);
}

export function warning(text:string='Warning!') {
  toast.warning(text);
}