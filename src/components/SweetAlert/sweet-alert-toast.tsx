import Swal, { SweetAlertOptions } from 'sweetalert2'

const SweetAlertToast = (options: SweetAlertOptions) => {
  const toast = Swal.mixin({
    toast: true,
    position: options.position || 'bottom',
    showConfirmButton: options.showConfirmButton || false,
    timer: options.timer || 500000,
    timerProgressBar: options.timerProgressBar || false,
    heightAuto: false,
    background: options.background || `hsl(var(--b3)`,
    iconColor: '#FFFFFF',
    didOpen: toasted => {
      toasted.addEventListener('mouseenter', Swal.stopTimer)
      toasted.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  return void toast.fire({
    icon: options.icon,
    title: `<span style="color: #FFFFFF">${options?.text as string}</span>`,
  })
}

export default SweetAlertToast
