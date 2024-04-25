import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BurgerMenu } from './BurgerMenu';
import { Nav } from './Nav';



/**
 * Komponen Header yang menampilkan navigasi dan menu burger.
 * 
 * @returns {object} Objek yang berisi komponen Nav dan BurgerMenu.
 */
const Header = () => {
  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  const [isBurgerOpened, setIsBurgerOpened] = useState(false);



  /**
   * Menangani klik pada tombol "Cari Pekerjaan".
   * Jika pengguna belum masuk, akan diarahkan ke halaman masuk.
   * Jika pengguna sudah masuk, akan diarahkan ke halaman daftar pekerjaan.
   */
  function handleFindJobOnClick() {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    setIsBurgerOpened(false);
    navigate('/job-list');
  }

  /**
   * Menangani klik pada tombol "Pasang Pekerjaan".
   * Jika pengguna belum masuk, akan diarahkan ke halaman masuk.
   * Jika pengguna sudah masuk, akan diarahkan ke halaman pasang pekerjaan.
   */
  function handlePostJobOnClick() {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    navigate('/post-job');
  }



  return {
    /**
     * Komponen navigasi.
     */
    Nav: (
      <Nav
        isBurgerOpened={isBurgerOpened} setIsBurgerOpened={setIsBurgerOpened}
        handleFindJobOnClick={handleFindJobOnClick}
        handlePostJobOnClick={handlePostJobOnClick}
        user={user}
        navigate={navigate}
      />
    ),
    /**
     * Komponen menu burger.
     */
    BurgerMenu: (
      <BurgerMenu
        isBurgerOpened={isBurgerOpened} setIsBurgerOpened={setIsBurgerOpened}
        handleFindJobOnClick={handleFindJobOnClick}
        handlePostJobOnClick={handlePostJobOnClick}
        user={user}
        navigate={navigate}
      />
    )
  }
};



export { Header };

