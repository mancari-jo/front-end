import { useState } from 'react';

import { hide } from '../../assets/svg';



/**
 * Komponen input yang memungkinkan pengguna untuk memasukkan teks.
 * 
 * @param {string} label Label untuk input.
 * @param {string} value Nilai dari input.
 * @param {function} onChange Fungsi yang dipanggil ketika nilai input berubah.
 * @param {string} placeholder Teks yang ditampilkan sebagai placeholder di dalam input.
 * @param {string} type Tipe input (misalnya, 'text', 'password', 'email').
 * @param {boolean} required Menentukan apakah input wajib diisi atau tidak.
 * @param {boolean} hidden Menentukan apakah input berisi teks tersembunyi atau tidak.
 * @param {boolean} disabled Menentukan apakah input dinonaktifkan atau tidak.
 * @returns {JSX.Element} Komponen React untuk input.
 */
const Input = ({
  label='',
  value,
  onChange,
  placeholder,
  type='text',
  required,
  hidden,
  disabled
}) => {
  const [isValueHidden, setIsValueHidden] = useState(hidden);


  
  return (
    <div className='text-base text-black flex flex-col'>
      <label>{label}</label>
      <div className='flex-1 flex rounded items-center gap-1 bg-white'>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          type={isValueHidden ? 'password' : type}
          required={required}
          disabled={disabled}
          className='flex-1 p-2 rounded disabled:hover:cursor-not-allowed'
        />
        {hidden && (
          <button
            onClick={() => setIsValueHidden(!isValueHidden)}
            type='button'
            className='p-2'
          >
            <img src={hide} alt='hide' />
          </button>
        )}
      </div>
    </div>
  );
};



export { Input };

