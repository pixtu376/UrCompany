import React from 'react'
import { Controller } from 'react-hook-form'

export function TextInput({ label, name, register, required, errors, placeholder, type = 'text' }) {
  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className={errors[name] ? 'input-error' : ''}
      />
      {errors[name] && <p className='error-message'>{label} обязательно для заполнения</p>}
    </div>
  )
}

export function CheckboxInput({ label, name, control, errors }) {
  return (
    <div className='form-group checkbox-group'>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <input
              type='checkbox'
              id={name}
              {...field}
              checked={field.value || false}
            />
            <label htmlFor={name}>{label}</label>
          </>
        )}
      />
      {errors[name] && <p className='error-message'>{label} обязательно для выбора</p>}
    </div>
  )
}

export function RadioGroup({ label, name, options, control, errors }) {
  return (
    <fieldset className='form-group'>
      <legend>{label}</legend>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) =>
          options.map(option => (
            <label key={option.value} htmlFor={`${name}-${option.value}`}>
              <input
                type='radio'
                id={`${name}-${option.value}`}
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
              />
              {option.label}
            </label>
          ))
        }
      />
      {errors[name] && <p className='error-message'>{label} обязательно для выбора</p>}
    </fieldset>
  )
}
