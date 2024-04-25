import { Button } from '../../components/button';
import { Input } from '../../components/input';



/**
 * Komponen untuk menampilkan form input password.
 * @param {Object} props - Properti yang diterima oleh komponen.
 * @param {Function} props.handleFormOnSubmit - Handler untuk mengirim formulir.
 * @param {string} props.password - Nilai input password.
 * @param {Function} props.setPassword - Setter untuk nilai input password.
 * @param {string} props.confirmPassword - Nilai input konfirmasi password.
 * @param {Function} props.setConfirmPassword - Setter untuk nilai input konfirmasi password.
 * @param {boolean} props.isFormSubmitting - Status pengiriman formulir.
 */
const PasswordInputsForm = ({
  handleFormOnSubmit,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  isFormSubmitting
}) => {
  return (
    <form onSubmit={handleFormOnSubmit} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Input
          placeholder='Masukkan Kata Sandi Baru'
          value={password}
          onChange={setPassword}
          required
          hidden
          disabled={isFormSubmitting}
        />
        <Input
          placeholder='Konfirmasi Kata Sandi'
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          hidden
          disabled={isFormSubmitting}
        />
      </div>

      <Button type='submit' disabled={isFormSubmitting}>
        Konfirmasi
      </Button>
    </form>
  );
};



export { PasswordInputsForm };

