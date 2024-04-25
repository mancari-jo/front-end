import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Select } from '../../components/select';



/**
 * Komponen untuk menerima input nama pengguna dan jenis pengguna.
 * @param {Object} props - Properti yang diterima oleh komponen.
 * @param {Function} props.handleFormOnSubmit - Fungsi penanganan saat formulir disubmit.
 * @param {string} props.username - Nilai dari input nama pengguna.
 * @param {Function} props.setUsername - Fungsi untuk mengatur nilai input nama pengguna.
 * @param {string} props.role - Nilai dari input jenis pengguna.
 * @param {Function} props.setRole - Fungsi untuk mengatur nilai input jenis pengguna.
 * @param {boolean} props.isFormSubmitting - Status apakah formulir sedang dalam proses submit.
 */
const UsernameInputForm = ({
  handleFormOnSubmit,
  username, setUsername,
  role, setRole,
  isFormSubmitting
}) => {
  return (
    <form onSubmit={handleFormOnSubmit} className='flex flex-col gap-4'>
      <Input
        label='Nama Pengguna'
        placeholder='Masukkan nama pengguna...'
        value={username}
        onChange={setUsername}
        required
        disabled={isFormSubmitting}
      />
      
      <Select
        label='Jenis Pengguna'
        theme='secondary'
        value={role}
        onChange={setRole}
        options={[
          ['jobSeeker', 'Pencari Kerja'],
          ['jobProvider', 'Penyedia Kerja']
        ]}
        required
      />

      <Button type='submit' disabled={isFormSubmitting}>
        Lanjut
      </Button>
    </form>
  );
};



export { UsernameInputForm };

