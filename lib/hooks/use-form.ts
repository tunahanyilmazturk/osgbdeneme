"use client";

import { useState, useCallback, FormEvent } from "react";

interface FormConfig<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  touched: Partial<Record<keyof T, boolean>>;
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const { initialValues, onSubmit, validate } = config;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    touched: {},
  });

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
      errors: { ...prev.errors, [field]: undefined },
    }));
  }, []);

  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
      touched: {},
    });
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      // Validate
      if (validate) {
        const validationErrors = validate(state.values);
        if (Object.keys(validationErrors).length > 0) {
          setState((prev) => ({
            ...prev,
            errors: validationErrors,
            touched: Object.keys(validationErrors).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            ) as Partial<Record<keyof T, boolean>>,
          }));
          return;
        }
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.values);
        setState((prev) => ({ ...prev, isSubmitting: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [state.values, onSubmit, validate]
  );

  return {
    values: state.values,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    touched: state.touched,
    setValue,
    setValues,
    reset,
    handleSubmit,
  };
}
