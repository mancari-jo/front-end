import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '../../components/button';
import { Header } from '../../components/header';
import { BASE_URL } from '../../constants';



/**
 * Komponen untuk menampilkan daftar pekerjaan yang tersedia.
 */
const Testimony = () => {
  const { Nav, BurgerMenu } = Header();

  const user = useSelector(state => state.user);

  const [userData, setUserData] = useState(null);
  const [testimony, setTestimony] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);




  useEffect(() => {
    getUserData();
  }, []);



  async function getUserData() {
    try {
      setIsFormLoading(true);

      const res = await axios.get(`${BASE_URL}/user/${user.id}`);

      if (!res.data?.status) throw new Error();

      setUserData(res.data.data);
      setTestimony(res.data.data.testimoni ?? '');
      console.log('res.data.data', res.data.data);
    } catch (err) {
      console.error('Unable to get user data: ', err);
    } finally {
      setIsFormLoading(false);
    }
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    
    try {
      setIsFormLoading(true);

      const payload = {
        ...userData,
        testimoni: testimony ? testimony.trim() : null
      };
      const res = await axios.patch(`${BASE_URL}/user/${user.id}`, payload);

      if (!res.data?.status) throw new Error();
      getUserData();
    } catch (err) {
      console.error('Unable to patch user data: ', err);
    } finally {
      setIsFormLoading(false);
    }
  }



  return (
    <main className='bg-2 overflow-auto'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='text-xs flex-1 flex flex-col justify-center items-center overflow-auto px-4 md:px-16 xl:px-32'>
          <h1 className='font-bold text-sm'>Berikan testimoni untuk aplikasi kami</h1>
          
          <form onSubmit={handleOnSubmit} className='w-full mt-4 flex flex-col items-center gap-2'>
            <textarea
              value={testimony}
              onChange={e => setTestimony(e.target.value)}
              className='w-4/5 text-xs flex-1 p-1 rounded disabled:hover:cursor-not-allowed'
              disabled={isFormLoading}
            />
            <div>
              <Button type='submit' disabled={isFormLoading}>Masukkan Testimoni</Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};



export { Testimony };

