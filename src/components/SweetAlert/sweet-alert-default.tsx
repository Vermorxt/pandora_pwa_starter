import Swal, { SweetAlertOptions } from 'sweetalert2'

const SweetAlertDefault = (options: SweetAlertOptions) =>
  Swal.fire({
    title: options?.title,
    text: options?.text,
    html: options?.html,
    icon: options?.icon,
    showCancelButton: 'showCancelButton' in options ? options.showCancelButton : true,
    confirmButtonColor: options?.confirmButtonColor || '#198f35',
    cancelButtonColor: options?.cancelButtonColor || '#D01919',
    confirmButtonText: options?.confirmButtonText || 'Ok',
    cancelButtonText: options?.cancelButtonText || 'Cancel',
    heightAuto: false,
  })

export default SweetAlertDefault
