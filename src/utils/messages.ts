// Foo.jsx
import Toast from 'react-native-toast-message';



type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    type: ToastType;
    title: string;
    message: string;
}

const showToast = ({type, title, message}: ToastProps) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message
    });
 }


  export const messages = { showToast }
