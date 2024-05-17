import { Button } from '../../components/button';



/**
 * Komponen untuk menampilkan pesan keberhasilan perubahan kata sandi.
 * @param {Object} props - Properti yang diterima oleh komponen.
 * @param {Function} props.navigate - Fungsi navigasi untuk kembali.
 */
const Success = ({ navigate }) => {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-center text-sm'>Kata Sandi berhasil diubah</h3>

      <Button onClick={() => navigate(-1)}>Kembali</Button>
    </div>
  );
};



export { Success };

