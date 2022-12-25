import SweetAlertToast from '../SweetAlert/sweet-alert-toast'

const ApiErrorHandler = (error: { message: string }) => {
  console.log('error: ', error)

  return void SweetAlertToast({
    icon: 'error',
    text: error?.message,
    showConfirmButton: true,
  })
}

export default ApiErrorHandler
