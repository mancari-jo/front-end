import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { logo } from '../../assets/img';
import { burger } from '../../assets/svg';
import { Button } from '../../components/button';
import { Select } from '../../components/select';
import { clearUser } from '../../redux/reducers/userSlice';



/**
 * Komponen navigasi yang menampilkan header aplikasi.
 * 
 * @param {boolean} isBurgerOpened Status untuk menampilkan atau menyembunyikan menu burger.
 * @param {function} setIsBurgerOpened Fungsi untuk mengatur status menu burger.
 * @param {function} handleFindJobOnClick Fungsi yang dipanggil saat tombol "Cari Pekerjaan" diklik.
 * @param {function} handlePostJobOnClick Fungsi yang dipanggil saat tombol "Tambah Pekerjaan" diklik.
 * @param {Object} user Informasi pengguna yang masuk.
 * @param {function} navigate Fungsi untuk navigasi ke halaman lain.
 * @returns {JSX.Element} Komponen React untuk navigasi header.
 */
const Nav = ({
  isBurgerOpened, setIsBurgerOpened,
  handleFindJobOnClick,
  handlePostJobOnClick,
  user,
  navigate
}) => {
  const dispatch = useDispatch();

  const [headerProfileOptionIndex, setHeaderProfileOptionIndex] = useState('0');



  useEffect(() => {
    if (headerProfileOptionIndex === '1') navigate(`/profile/${user.id}`);
    else if (headerProfileOptionIndex === '2') handleSetPreferenceOnClick();
    else if (headerProfileOptionIndex === '3') handleMessageOnClick();
    else if (headerProfileOptionIndex === '4') handleExitOnPress();
    
    setHeaderProfileOptionIndex('0');
  }, [headerProfileOptionIndex]);



  

  /**
   * Menangani klik pada tombol "Pesan".
   */
  function handleMessageOnClick() {
    console.log('handleMessageOnClick');
  }

  /**
   * Menangani klik pada tombol "Atur Preferensi".
   */
  function handleSetPreferenceOnClick() {
    navigate('/job-preference');
  }

  /**
   * Menangani klik pada tombol "Keluar".
   */
  function handleExitOnPress() {
    dispatch(clearUser());
    navigate('/job-list');
  }



  return (
    <header className='bg-white flex justify-between shadow-2xl p-4'>
      {/* logo */}
      <div className='flex-1 flex items-center gap-3'>
        <img
          src={logo}
          alt='logo'
          className='h-16 w-16 xl:h-32 xl:w-32'
        />
        <div className='text-base xl:text-4xl font-bold italic text-secondary'>
          <h1>Mancari Jo</h1>
          <h1 className='hidden xl:block'>Minahasa Utara</h1>
        </div>
      </div>

      {/* options */}
      <div className='hidden flex-1 xl:flex flex-row items-center gap-4'>
        <div>
          <Button theme='tertiary' onClick={handleFindJobOnClick}>
            Cari Pekerjaan
          </Button>
        </div>
        {(user?.role === 'jobProvider' || !user) && (
          <div>
            <Button theme='tertiary' onClick={handlePostJobOnClick}>
              Tambah Pekerjaan
            </Button>
          </div>
        )}
        {(user?.role === 'jobProvider') && (
          <div>
            <Button theme='tertiary' onClick={() => navigate('/posted-job-list')}>
              Lihat Daftar Pekerjaan
            </Button>
          </div>
        )}
        <div>
          <Button theme='tertiary' onClick={() => navigate('/about-us')}>
            Tentang Kami
          </Button>
        </div>
      </div>

      {/* sign-in/sign-up/profile */}
      <div className='flex-1 flex flex-col justify-center items-end gap-2'>
        <button className='xl:hidden' onClick={() => setIsBurgerOpened(!isBurgerOpened)}>
          <img src={burger} alt='burger' />
        </button>

        {user ? (
          <Select
            theme='secondary'
            value={headerProfileOptionIndex}
            onChange={setHeaderProfileOptionIndex}
            options={[
              ['0', 'Profil'],
              ['1', 'Lihat Profil'],
              ['2', 'Atur Preferensi'],
              ['3', 'Pesan'],
              ['4', 'Keluar']
            ]}
          />
        ) : (
          <div className='hidden xl:flex gap-2'>
            <Button theme='tertiary' onClick={() => navigate('/sign-in')}>Masuk</Button>
            <div className='border border-black' />
            <Button theme='tertiary' onClick={() => navigate('/sign-up')}>Daftar</Button>
          </div>
        )}
      </div>
    </header>
  );
};



export { Nav };

