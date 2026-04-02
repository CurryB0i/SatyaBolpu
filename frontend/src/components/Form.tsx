import React, { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import Button from './Button';
import { FormField, FormProps } from '../types/globals';

const Form: React.FC<FormProps> = ({
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  error,
  loading = false,
  submitText = 'Submit',
  loadingText = 'Submitting',
  className = '',
  formClassName = ''
}) => {

  const [errors,setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setErrors(prev => ({
      ...prev,
      [name] : ''
    }))
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      onChange(name, file);
    } else if (type === 'radio') {
      const radioInput = e.target as HTMLInputElement;
      onChange(name, radioInput.value);
    } else {
      onChange(name, value);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
      
      if (field.validation && value) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        return;
      }
    
    onSubmit(e);
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name]
    const fieldValue = formData[field.name] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label htmlFor={field.name} className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={field.rows || 4}
              value={fieldValue}
              onChange={handleInputChange}
              className="text-black font-semibold p-2 overflow-hidden resize-none disabled:bg-gray-400"
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label htmlFor={field.name} className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              className="p-2 cursor-pointer disabled:bg-gray-300"
              disabled={field.disabled}
            >
              <option value="" hidden className="text-white">
                {field.placeholder || `-- Choose ${field.label.toLowerCase()} --`}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <label htmlFor={field.name} className="w-fit">
              <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
                justify-center border-3 border-solid border-primary  
                ${field.disabled ? 'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
                <FaUpload />
                <p>Upload {field.label}</p>
              </div>
            </label>
            <input
              className="hidden"
              type="file"
              id={field.name}
              name={field.name}
              accept={field.accept}
              onChange={handleInputChange}
              disabled={field.disabled}
            />
            {fieldValue && fieldValue instanceof File && (
              <div className="w-1/2 border-2 border-solid border-white flex">
                <img 
                  className="w-full aspect-square object-cover object-center" 
                  src={URL.createObjectURL(fieldValue)} 
                  alt="Preview" 
                />
              </div>
            )}
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="flex gap-10">
              {field.options?.map((option) => (
                <label key={option.value} className="text-white text-[1.5rem] cursor-pointer" htmlFor={`${field.name}-${option.value}`}>
                  <input
                    className="cursor-pointer mr-2"
                    type="radio"
                    id={`${field.name}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    checked={fieldValue === option.value || fieldValue === String(option.value)}
                    onChange={handleInputChange}
                    disabled={field.disabled}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label htmlFor={field.name} className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              className="text-black font-semibold p-2 disabled:bg-gray-400"
              placeholder={field.placeholder}
              disabled={field.disabled}
              min={field.min}
              max={field.max}
            />
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="flex flex-col w-full gap-3">
            <label htmlFor={field.name} className="text-primary font-semibold text-[1.5rem]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              className="text-black font-semibold p-2 disabled:bg-gray-400"
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
            {fieldError && (
              <p className="text-red-500">{fieldError}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className={`bg-black p-8 rounded-2xl w-1/3 max-w-[90%] max-h-[90vh] overflow-y-auto border-solid border-white ${formClassName}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl transition-colors"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {fields.map(field => (
            <div key={field.name}>
              {renderField(field)}
            </div>
          ))}
          
          { error && (
            <p className="text-red-500">{error}</p>
          )}
          
          <Button
            content={submitText}
            loading={loading}
            loadingText={loadingText}
            type="submit"
            className='w-fit mx-auto'
          />
        </form>
      </div>
    </div>
  );
};

export default Form;
