import { act, render, RenderResult } from '@testing-library/react'
import React from 'react'

export const renderWithAct = async (element: React.ReactElement) => {
  let result

  await act(async () => {
    result = render(element)
  })

  return result as unknown as RenderResult
}

export const actAsync = async (callback: () => void) => {
  await act(async () => callback())
}
