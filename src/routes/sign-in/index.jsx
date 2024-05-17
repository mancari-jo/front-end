import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logo } from '../../assets/img';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import { BASE_URL } from '../../constants';
import { setUser } from '../../redux/reducers/userSlice';



/**
 * Komponen untuk proses masuk ke dalam aplikasi.
 */
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [role, setRole] = useState('jobSeeker');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Menangani penyerahan formulir masuk.
   * @param {object} e - Objek event.
   */
  async function handleFormOnSubmit(e) {
    e.preventDefault();
    
    try {
      setIsFormSubmitting(true);

      if (!role || !username || !password) return;

      const payload = {
        namaPengguna: username,
        kataSandi: password,
        role
      };

      const res = await axios.post(`${BASE_URL}/auth/login`, payload);

      if (!res.data?.status) throw new Error();

      const { user } = res.data;
      dispatch(setUser({
        id: user.id,
        username: user.username,
        role: user.role,
        storageLocation: isRememberMeChecked ? 'local' : 'storage'
      }));
    } catch (err) {
      console.error('Unable to sign in: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }



  return (
    <main className='bg-1 justify-center items-center p-4'>
      <div className='absolute top-2 left-2'>
        <Button theme='tertiary' onClick={() => navigate(-1)}>Kembali</Button>
      </div>

      <img src={logo} alt='logo' className='h-32' />

      <div className='mt-2 font-medium text-center'>
        Tersedia peluang karier istimewa! Temukan pekerjaan di kantor atau di rumah. Login sekarang untuk langkah pertama menuju kesuksesan!
      </div>

      <form onSubmit={handleFormOnSubmit} className='mt-4 flex flex-col gap-4 w-full max-w-96'>
        <Select
          value={role}
          onChange={setRole}
          options={[
            ['jobSeeker', 'Pencari Kerja'],
            ['jobProvider', 'Penyedia Kerja']
          ]}
          required
        />

        <Input
          label='Nama Pengguna'
          value={username}
          onChange={setUsername}
          required
          disabled={isFormSubmitting}
        />

        <Input
          label='Kata Sandi'
          value={password}
          onChange={setPassword}
          required
          hidden
          disabled={isFormSubmitting}
        />

        <div className='flex justify-between items-center'>
          <div>
            <input
              type='checkbox'
              checked={isRememberMeChecked}
              onChange={() => setIsRememberMeChecked(!isRememberMeChecked)}
              disabled={isFormSubmitting}
            />
            <label className='ml-1 font-medium'>Ingat Saya</label>
          </div>

          <div>
            <Button
              theme='tertiary'
              onClick={() => navigate('/forgot-password')}
              disabled={isFormSubmitting}
            >
              Lupa Kata Sandi?
            </Button>
          </div>
        </div>

        <div className='mt-2 flex flex-col gap-2'>
          <Button type='submit' disabled={isFormSubmitting}>Masuk</Button>
          <Button
            theme='secondary'
            onClick={() => navigate('/sign-up')}
            disabled={isFormSubmitting}
          >
            Buat Akun
          </Button>
        </div>
      </form>
    </main>
  );
};



export { SignIn };

