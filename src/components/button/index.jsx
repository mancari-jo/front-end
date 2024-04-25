/**
 * Komponen tombol yang dapat disesuaikan dengan tema dan perilaku.
 * 
 * @param {string} theme Tema tombol ('primary', 'secondary', 'tertiary', 'danger').
 * @param {ReactNode} children Isi dari tombol.
 * @param {function} onClick Fungsi yang dipanggil ketika tombol diklik.
 * @param {string} type Tipe tombol (misalnya, 'button', 'submit', 'reset').
 * @param {boolean} disabled Menentukan apakah tombol dinonaktifkan atau tidak.
 * @returns {JSX.Element} Komponen React untuk tombol.
 */
const Button = ({
  theme='primary',
  children,
  onClick,
  type='button',
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`w-full rounded p-2 text-base disabled:hover:cursor-not-allowed
        ${(theme === 'primary') ? 'text-white bg-primary' :
          (theme === 'secondary') ? 'text-black bg-neutral-100' :
          (theme === 'tertiary') ? 'text-black bg-transparent' :
          (theme === 'danger') ? 'text-white bg-red-500' : ''}
      `}
    >
      {children}
    </button>
  );
};



export { Button };

