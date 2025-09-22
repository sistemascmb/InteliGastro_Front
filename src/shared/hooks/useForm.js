import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }, [errors]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValue(name, newValue);
  }, [setValue]);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setFieldTouched(name, true);

    // Validate field on blur if schema provided
    if (validationSchema && validationSchema[name]) {
      try {
        validationSchema[name].parse(values[name]);
        setFieldError(name, undefined);
      } catch (error) {
        setFieldError(name, error.message);
      }
    }
  }, [validationSchema, values, setFieldTouched, setFieldError]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;

    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      try {
        validationSchema[fieldName].parse(values[fieldName]);
      } catch (error) {
        newErrors[fieldName] = error.message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const handleSubmit = useCallback((onSubmit) => {
    return async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      // Mark all fields as touched
      const allFieldsNames = Object.keys(values);
      const touchedFields = allFieldsNames.reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {});
      setTouched(touchedFields);

      try {
        const isValid = validate();
        if (isValid) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validate]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && !!errors[name],
    helperText: touched[name] && errors[name],
  }), [values, handleChange, handleBlur, touched, errors]);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setFieldError,
    setFieldTouched,
    setFormValues,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    getFieldProps,
  };
};

export default useForm;