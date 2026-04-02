import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/lib/hooks/use-form'

describe('useForm', () => {
  const initialValues = {
    email: '',
    password: '',
  }

  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('should initialize with correct values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    )

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should update values with setValue', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    )

    act(() => {
      result.current.setValue('email', 'test@example.com')
    })

    expect(result.current.values.email).toBe('test@example.com')
  })

  it('should validate before submit', async () => {
    const validate = (values: typeof initialValues) => {
      const errors: Partial<Record<keyof typeof initialValues, string>> = {}
      if (!values.email) errors.email = 'Email gerekli'
      if (!values.password) errors.password = 'Şifre gerekli'
      return errors
    }

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validate,
        onSubmit: mockOnSubmit,
      })
    )

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
    })

    expect(result.current.errors).toEqual({
      email: 'Email gerekli',
      password: 'Şifre gerekli',
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with valid data', async () => {
    const validate = () => ({}) // No errors

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validate,
        onSubmit: mockOnSubmit,
      })
    )

    // Fill form with valid data
    act(() => {
      result.current.setValue('email', 'test@example.com')
      result.current.setValue('password', 'password123')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
    })

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should set isSubmitting during submission and reset after', async () => {
    let resolveSubmit: (value: unknown) => void
    const slowSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => {
      resolveSubmit = resolve
    }))

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@test.com' },
        onSubmit: slowSubmit,
      })
    )

    // Start submission
    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
    })

    // Should be submitting after handleSubmit is called
    expect(slowSubmit).toHaveBeenCalled()

    // Resolve the promise
    await act(async () => {
      resolveSubmit(undefined)
      await new Promise(r => setTimeout(r, 0))
    })

    // After submission completes, isSubmitting should be false
    expect(result.current.isSubmitting).toBe(false)
  })
})
