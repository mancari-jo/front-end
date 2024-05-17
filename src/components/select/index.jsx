/**
 * Komponen select yang memungkinkan pengguna untuk memilih opsi dari daftar.
 * 
 * @param {string} theme Tema untuk select ('primary', 'secondary').
 * @param {string} label Label untuk select.
 * @param {string} value Nilai yang dipilih dari select.
 * @param {function} onChange Fungsi yang dipanggil ketika nilai select berubah.
 * @param {Array} options Daftar opsi yang tersedia dalam select.
 * @param {boolean} required Menentukan apakah select wajib dipilih atau tidak.
 * @param {boolean} disabled Menentukan apakah select dinonaktifkan atau tidak.
 * @returns {JSX.Element} Komponen React untuk select.
 */
const Select = ({
  theme='primary',
  label='',
  value,
  onChange=()=>{},
  options=[],
  required,
  disabled
}) => {
  return (
    <div className='text-xs text-black flex flex-col'>
      <label>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`rounded p-1 text-xs hover:cursor-pointer disabled:hover:cursor-not-allowed
          ${(theme === 'primary') ? 'bg-secondary text-white' :
            (theme === 'secondary') ? 'bg-white' : ''}
        `}
      >
        {options.map((option, index) => (
          <option key={index} value={option[0]}>{option[1]}</option>
        ))}
      </select>
    </div>
  );
};



export { Select };

