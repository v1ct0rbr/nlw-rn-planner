// Foo.jsx
import { StyleSheet } from 'react-native'
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
    props: {
      styles: {
        ...styles.toastStyle,
      },
    },
  })
}

const styles = StyleSheet.create({
  toastStyle: {
    zIndex: 100000000, // Alterar o zIndex aqui
  },
})

export const messages = { showToast }
