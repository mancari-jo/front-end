import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { defaultProfilePicture } from '../../assets/img';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import { BASE_URL } from '../../constants';



/**
 * Komponen untuk mengedit profil pengguna.
 */
const EditProfile = () => {
  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  const fileInputRef = useRef(null);

  const [fetchedUser, setFetchedUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [lastEducation, setLastEducation] = useState('');
  const [isFormSubmitting, setIsForumSubmitting] = useState(false);



  /**
   * Mengirim permintaan untuk mengambil data pengguna dari server setiap kali data pengguna berubah.
   */
  useEffect(() => {
    if (user) fetchUser();
  }, [user]);

  /**
   * Memperbarui formulir dengan data pengguna yang telah diambil setelah komponen diload.
   */
  useEffect(() => {
    if (fetchedUser) updateForm();
  }, [fetchedUser]);



  /**
   * Mengirim permintaan untuk mengambil data pengguna dari server.
   */
  async function fetchUser() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${user.id}`);

      if (!res.data?.status) throw new Error();

      const newFetchedUser = res.data.data;

      if (newFetchedUser.role === 'jobSeeker') {
        setFetchedUser({
          profilePicture: newFetchedUser.fotoProfil,
          username: newFetchedUser.namaPengguna,
          name: newFetchedUser.nama,
          birthplace: newFetchedUser.tempatLahir,
          birthDate: newFetchedUser.tanggalLahir,
          lastEducation: newFetchedUser.pendidikanTerakhir
        });
      } else {
        setFetchedUser({
          name: newFetchedUser.nama
        });
      }
    } catch (err) {
      console.error('Unable to get user: ', err);
      navigate(-1);
    }
  }

  /**
   * Memperbarui formulir dengan data pengguna yang telah diambil dari server.
   */
  function updateForm() {
    setProfilePicture(fetchedUser.profilePicture)
    setUsername(fetchedUser.username);
    setName(fetchedUser.name);
    setBirthplace(fetchedUser.birthplace);
    setBirthDate(fetchedUser.birthDate);
    setLastEducation(fetchedUser.lastEducation);
  }

  /**
   * Mengirim perubahan data pengguna ke server untuk disimpan.
   * @param {Event} e - Event form submit.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsForumSubmitting(true);

      if (!username || !password || !confirmPassword || (password !== confirmPassword) || !name || !birthplace || !birthDate || !lastEducation) return;

      const payload = {
        fotoProfil: profilePicture,
        namaPengguna: username,
        kataSandi: password,
        nama: name,
        tempatLahir: birthplace,
        tanggalLahir: birthDate,
        pendidikanTerakhir: lastEducation
      };

      const res = await axios.patch(`${BASE_URL}/user/${user.id}`, payload);

      if (!res.data?.status) throw new Error();

      navigate(-1);
    } catch (err) {
      console.error('Unable to sign up: ', err);
    } finally {
      setIsForumSubmitting(false);
    }
  }

  /**
   * Mengubah gambar profil pengguna saat memilih file.
   * @param {Event} e - Event saat memilih file.
   */
  function handleChangeProfilePicture(e) {
    const newProfilePicture = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setProfilePicture(base64String);

      e.target.value = null;
    }

    reader.readAsDataURL(newProfilePicture);
  }



  return (
    <main className='bg-1 h-screen flex overflow-auto select-none p-8 sm:p-16 items-center'>
      <h1 className='text-lg sm:text-2xl font-bold w-full'>Edit Profil</h1>

      {!fetchedUser ? (
        <div className='flex-1 mt-8 sm:mt-16 flex'>
          <h1>Sedang memuat data ...</h1>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex-1 flex flex-col gap-4 sm:gap-8 justify-center w-full max-w-96'>
          <div className='flex justify-center relative'>
            <img
              src={profilePicture ? profilePicture : fetchedUser.profileImage ? fetchedUser.profileImage : defaultProfilePicture}
              alt='profile'
              className='h-20 w-20 sm:h-40 sm:w-40 rounded-full'
            />
            <div className='absolute group h-20 w-20 sm:h-40 sm:w-40 rounded-full flex justify-center items-center group'>
              <button onClick={() => fileInputRef.current.click()} className='h-full w-full rounded-full hidden justify-center items-center transition-all group-hover:flex hover:cursor-pointer hover:bg-neutral-500 hover:bg-opacity-75'>
                <div className='text-center text-white p-2 text-xs sm:text-base'>Ganti Foto Profil</div>
                <input type='file' accept='image/*' onChange={handleChangeProfilePicture} className='hidden' ref={fileInputRef} />
              </button>
            </div>
          </div>

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

          <Input
            label='Konfirmasi Kata Sandi'
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            hidden
            disabled={isFormSubmitting}
          />

          <Input
            label='Nama'
            value={name}
            onChange={setName}
            required
            disabled={isFormSubmitting}
          />

          {user.role === 'jobSeeker' && (
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
            </>
          )}

          <div className='flex gap-4'>
            <Button
              theme='secondary'
              onClick={() => navigate(-1)}
              disabled={isFormSubmitting}
            >
              Batal
            </Button>
            <Button type='submit' disabled={isFormSubmitting}>Simpan</Button>
          </div>
        </form>
      )}
    </main>
  );
};



export { EditProfile };

