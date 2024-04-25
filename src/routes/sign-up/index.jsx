import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logo } from '../../assets/img';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import { BASE_URL } from '../../constants';



/**
 * Komponen untuk proses pendaftaran akun baru.
 */
const SignUp = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [lastEducation, setLastEducation] = useState('SD');
  const [role, setRole] = useState('jobSeeker');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Menangani penyerahan formulir pendaftaran akun.
   * @param {object} e - Objek event.
   */
  async function handleFormOnSubmit(e) {
    e.preventDefault();

    try {
      setIsFormSubmitting(true);

      if (!username || !password || !passwordConfirmation || (password !== passwordConfirmation) || !name) return;

      const payload = {
        namaPengguna: username,
        kataSandi: password,
        nama: name,
        tempatLahir: birthplace,
        tanggalLahir: birthDate,
        alamat: address,
        pendidikanTerakhir: lastEducation,
        role
      };

      const res = await axios.post(`${BASE_URL}/auth/register`, payload);

      if (!res.data?.status) throw new Error();

      navigate(-1);
    } catch (err) {
      console.error('Unable to sign up: ', err.message);
    } finally {
      setIsFormSubmitting(false);
    }
  }



  return (
    <main className='bg-1 justify-center items-center p-4'>
      <img src={logo} alt='logo' className='h-64' />

      <form onSubmit={handleFormOnSubmit} className='bg-neutral-100 p-8 rounded-2xl flex flex-col gap-4 w-full max-w-96 shadow-2xl overflow-auto'>
        <div className='italic text-center text-xs'>
          <p>Dengan membuat akun atau masuk,</p>
          <p>anda memahami dan menyetujui ketentuan MancariJo.</p>
          <p>Anda juga mengakui kebijakan 'Cookie & Privacy' kami.</p>
        </div>

        <h2 className='text-2xl text-center'>
          Daftar Akun
        </h2>

        <Input
          placeholder='Nama Pengguna'
          value={username}
          onChange={setUsername}
          type='username'
          required
          disabled={isFormSubmitting}
        />

        <Input
          placeholder='Kata Sandi'
          value={password}
          onChange={setPassword}
          hidden
          required
          disabled={isFormSubmitting}
        />

        <Input
          placeholder='Konfirmasi Kata Sandi'
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          hidden
          required
          disabled={isFormSubmitting}
        />

        <Input
          placeholder='Nama'
          value={name}
          onChange={setName}
          required
          disabled={isFormSubmitting}
        />

        {role === 'jobSeeker' && (
          <>
            <Input
              label='Tempat Lahir'
              value={birthplace}
              onChange={setBirthplace}
              required
              disabled={isFormSubmitting}
            />

            <Input
              label='Tanggal Lahir'
              value={birthDate}
              onChange={setBirthDate}
              type='date'
              required
              disabled={isFormSubmitting}
            />

            <Select
              label='Pendidikan Terakhir'
              theme='secondary'
              value={lastEducation}
              onChange={setLastEducation}
              options={[
                ['SD', 'SD'],
                ['SMP', 'SMP'],
                ['SMA', 'SMA'],
                ['Diploma', 'Diploma'],
                ['S1', 'S1'],
                ['S2', 'S2'],
                ['S3', 'S3']
              ]}
              disabled={isFormSubmitting}
            />

            <Input
              label='Alamat'
              value={address}
              onChange={setAddress}
              required
              disabled={isFormSubmitting}
            />
          </>
        )}

        <Select
          theme='secondary'
          value={role}
          onChange={setRole}
          options={[
            ['jobSeeker', 'Pencari Kerja'],
            ['jobProvider', 'Penyedia Kerja']
          ]}
        />

        <div className='mt-4 flex'>
          <div className='flex-1'>
            <Button
              theme='secondary'
              onClick={() => navigate(-1)}
              disabled={isFormSubmitting}
            >
              Kembali
            </Button>
          </div>
          <div className='flex-1'>
            <Button type='submit' disabled={isFormSubmitting}>
              Buat Akun
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};



export { SignUp };

