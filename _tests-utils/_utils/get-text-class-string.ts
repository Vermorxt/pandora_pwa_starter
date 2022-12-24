export const getTextClassString = (color: string) => {
  const bgTextPreSelector = 'text'
  const bgTextPostSelector = 'content'

  return `${bgTextPreSelector}-${color}-${bgTextPostSelector}`
}
