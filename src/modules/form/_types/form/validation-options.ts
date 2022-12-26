export interface ValidationOptions {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  valueAsNumber?: boolean
}
