import {Store} from 'react-notifications-component'
import "./style.css";

export const showMessage = (title, message, type) => {
  Store.addNotification({
    title: title,
    message: message,
    type: type, // success, danger, info, default, warning
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: false
    }
  });
};
