import React from 'react';

const TextInput = React.forwardRef(
    (
        { type, placeholder, styles, label, labelStyles, register, name, error }, ref
    ) => {
        return (
            <div className='w-full flex flex-col mt-2'>
                {label && (<p className={`text-gray-600 dark:text-gray-400 text-sm mb-2 ${labelStyles}`}>{label}</p>)}
                <div>
                    <input type={type} name={name} placeholder={placeholder} ref={ref} className={`bg-gray-100 dark:bg-gray-700 rounded border border-gray-600 dark:border-gray-400 outline-none text-sm text-gray-950 dark:text-gray-50 px-4 py-3 placeholder:text-gray-600 dark:placeholder:text-gray-400 ${styles}`}
                        {...register}
                        aria-invalid={error ? "true" : "false"}></input>
                </div>
                {error && (
                    <span className='text-xs text-primary-600 dark:text-primary-400 mt-0.5'>{error}</span>
                )}
            </div>
        );
    }
);

export default TextInput;