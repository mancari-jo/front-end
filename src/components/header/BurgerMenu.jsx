import { Button } from '../../components/button';



/**
 * Komponen menu burger yang menampilkan opsi navigasi.
 * 
 * @param {boolean} isBurgerOpened Status untuk menampilkan atau menyembunyikan menu burger.
 * @param {function} setIsBurgerOpened Fungsi untuk mengatur status menu burger.
 * @param {function} handleFindJobOnClick Fungsi yang dipanggil saat tombol "Cari Pekerjaan" diklik.
 * @param {function} handlePostJobOnClick Fungsi yang dipanggil saat tombol "Tambah Pekerjaan" diklik.
 * @param {Object} user Informasi pengguna yang masuk.
 * @param {function} navigate Fungsi untuk navigasi ke halaman lain.
 * @returns {JSX.Element} Komponen React untuk menu burger.
 */
const BurgerMenu = ({
  isBurgerOpened, setIsBurgerOpened,
  handleFindJobOnClick,
  handlePostJobOnClick,
  user,
  navigate
}) => {
  return (
    <div className={`${!isBurgerOpened ? 'hidden' : 'flex'} flex-col absolute h-full w-full z-10`}>
      <div className='bg-white flex flex-col items-center pb-4 gap-4'>
        <Button theme='tertiary' onClick={handleFindJobOnClick}>
          Cari Pekerjaan
        </Button>
        {(user?.role === 'jobProvider' || !user) && (
          <Button theme='tertiary' onClick={handlePostJobOnClick}>
            Tambah Pekerjaan
          </Button>
        )}
        {(user?.role === 'jobProvider') && (
          <Button theme='tertiary' onClick={() => navigate('/posted-job-list')}>
            Lihat Daftar Pekerjaan
          </Button>
        )}
        <Button theme='tertiary' onClick={() => navigate('/about-us')}>
          Tentang Kami
        </Button>
        {!user && (
          <div className='flex gap-2'>
            <Button theme='tertiary' onClick={() => navigate('/sign-in')}>Masuk</Button>
            <div className='border border-black' />
            <Button theme='tertiary' onClick={() => navigate('/sign-up')}>Daftar</Button>
          </div>
        )}
      </div>
      <div className='bg-white flex-1 opacity-75' onClick={() => setIsBurgerOpened(false)} />
    </div>
  );
};



export { BurgerMenu };

