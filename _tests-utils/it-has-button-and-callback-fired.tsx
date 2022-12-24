import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

export const itHasButtonAndCallbackFired = async (btnName: string, mockCallback: (e: any) => void) => {
  const button = await waitFor(() => screen.getByRole('button', { name: btnName }))

  act(() => {
    fireEvent.click(button)
  })

  expect(mockCallback).toHaveBeenCalled()
}
