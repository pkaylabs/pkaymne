/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import _ from 'lodash';
import clsx from 'clsx';
import classNames from '@/utils/classnames';

interface TextInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'number' | 'text' | 'email' | 'date' | 'password';
  values: any;
  handleChange: any;
  handleBlur: any;
  errors?: any;
  touched?: any;
  step?: number;
  min?: number | string;
  max?: number | string;
  labelHidden?: boolean;
  maxLength?: number;
  minLength?: number;
  postText?: string;
  preText?: string;
  borderless?: boolean;
  description?: string;
}

const TextInput: FC<TextInputProps> = ({
  id,
  type,
  step,
  values,
  handleChange,
  handleBlur,
  placeholder,
  label,
  errors,
  touched,
  required,
  maxLength,
  minLength,
  disabled,
  min,
  max,
  labelHidden,
  borderless,
  postText,
  description,
}) => {
  return (
    <div>
      {!labelHidden && (
        <label htmlFor={id} className='block text-xs font-light text-gray-700'>
          {label} {required ? <span className='text-red-500'>*</span> : ''}
        </label>
      )}
      {description && <p className='block text-xs text-gray-500 mt-1'>{description}</p>}
      <div className={classNames(labelHidden ? '' : 'mt-1', 'relative')}>
        <input
          type={type ?? 'text'}
          name={id}
          id={id}
          value={_.get(values, id)}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder || label || ''}
          step={step}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          style={{
            paddingRight: (postText?.length || 0) * 10,
          }}
          className={clsx(
            'focus:ring-primary-500 focus:border-primary-500 border-gray-300 shadow-sm block w-full sm:text-sm rounded-md placeholder:font-light placeholder:text-xs h-8',
            {
              'focus:ring-red-500 focus:border-red-500 border-red-600':
                _.get(errors, id) && _.get(touched, id),
              'cursor-not-allowed bg-gray-100': disabled,
              'border-0 border-gray-300': borderless,
            }
          )}
        />
        {_.get(errors, id) && _.get(touched, id) ? (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
          </div>
        ) : null}
        {postText && (
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            <span className='text-gray-500 sm:text-sm' id='price-currency'>
              {postText}
            </span>
          </div>
        )}
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className='mt-2 text-sm text-red-600' id={`${id}-error`}>
          {_.get(errors, id)}
        </p>
      ) : null}
    </div>
  );
};

export default TextInput;
