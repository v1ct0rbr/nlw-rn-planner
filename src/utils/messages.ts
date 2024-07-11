// Foo.jsx
import Toast from 'react-native-toast-message'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  message: string
}

const showToast = ({ type, title, message }: ToastProps) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
  })
}

export const messages = { showToast }
