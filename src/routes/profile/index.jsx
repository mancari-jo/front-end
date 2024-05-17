import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { defaultProfilePicture } from '../../assets/img';
import { starBlue, starWhite } from '../../assets/svg';
import { BASE_URL } from '../../constants';



function getAgeFromBirthDate(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}



/**
 * Komponen untuk menampilkan profil pengguna.
 */
const Profile = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const user = useSelector(state => state.user);

  const [fetchedUser, setFetchedUser] = useState(null);



  /**
   * Mengambil data pengguna saat komponen dimuat.
   */
  useEffect(() => {
    if (id) fetchUser();
  }, [id]);



  /**
   * Mengambil data pengguna dari server.
   */
  async function fetchUser() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${id}`);

      if (!res.data?.status) throw new Error();

      const newFetchedUser = res.data.data;

      if (newFetchedUser.role === 'jobSeeker') {
        setFetchedUser({
          name: newFetchedUser.nama,
          profilePicture: newFetchedUser.fotoProfil || '',
          rating: getJobSeekerRatingFromExperience(newFetchedUser.pengalamanKerja),
          birthPlace: newFetchedUser.tempatLahir,
          birthDate: newFetchedUser.tanggalLahir,
          lastEducation: newFetchedUser.pendidikanTerakhir,
          experience: newFetchedUser.pengalamanKerja,
          role: newFetchedUser.role
        });
      } else {
        setFetchedUser({
          name: newFetchedUser.nama,
          profilePicture: newFetchedUser.fotoProfil || '',
          role: newFetchedUser.role
        });
      }
    } catch (err) {
      console.error('Unable to get user: ', err);
      navigate(-1);
    }
  }

  /**
   * Menghitung rating pencari kerja berdasarkan pengalaman kerja.
   * @param {array} experiences - Daftar pengalaman kerja pengguna.
   * @returns {number} - Rating pencari kerja.
   */
  function getJobSeekerRatingFromExperience(experiences) {
    const totalRating = experiences.reduce((total, experience) => total + experience.rating, 0);

    const averageRating = totalRating / experiences.length;
    if (isNaN(averageRating)) return 0;

    const roundedUpAverageRatingValue = Math.ceil(averageRating);

    return roundedUpAverageRatingValue;
  }



  return (
    <main className='bg-1 h-screen flex overflow-auto select-none p-4'>
      {fetchedUser && <h1 className='text-sm font-bold'>Profil {(fetchedUser.role === 'jobSeeker') ? 'Pencari Kerja' : 'Penyedia Kerja'}</h1>}

      {!fetchedUser ? (
        <div className='text-sm flex-1 mt-4 flex justify-center items-center'>
          <h1>Sedang memuat data ...</h1>
        </div>
      ) : (
        <div className='mt-4 flex-1 flex flex-col sm:flex-row gap-4'>
          <section className='flex flex-col items-center sm:items-start gap-4'>
            <img
              src={fetchedUser.profilePicture || defaultProfilePicture }
              alt='profile'
              className='h-16 w-16 rounded-full'
            />
            <div className='flex sm:flex-col gap-4 sm:gap-2'>
              <div onClick={() => navigate(-1)} className='text-primary text-sm hover:cursor-pointer hover:underline'>Kembali</div>
              {(id === user.id) && <div onClick={() => navigate('/edit-profile')} className='text-primary text-sm hover:cursor-pointer hover:underline'>Edit Profil</div>}
            </div>
          </section>

          <section className='flex-1 flex flex-col gap-4'>
            <h2 className='text-sm'>{fetchedUser.name}</h2>

            {(fetchedUser.role === 'jobSeeker') && (
              <>
                <div>
                  <div>Rating</div>
                  <div className='mt-1 flex items-center gap-2'>
                    <div>{fetchedUser.rating}</div>
                    {[...new Array(fetchedUser.rating)].map((_, index) => <img key={index} src={starBlue} alt='star-blue' />)}
                    {[...new Array(5 - fetchedUser.rating)].map((_, index) => <img key={index} src={starWhite} alt='star-white' />)}
                  </div>
                </div>

                <div>
                  <div>Tentang</div>
                  <hr className='mt-1 border border-black' />
                  <div className='mt-2 flex gap-2'>
                    {/* labels */}
                    <div className='flex-1'>
                      <div>Tempat Lahir</div>
                      <div>Tanggal Lahir</div>
                      <div>Pendidikan Terakhir</div>
                      <div>Pengalaman</div>
                    </div>

                    {/* colons */}
                    <div>
                      <div>:</div>
                      <div>:</div>
                      <div>:</div>
                      <div>:</div>
                    </div>

                    {/* values */}
                    <div className='flex-1'>
                      <div>{fetchedUser.birthPlace ?? ''}</div>
                      <div>{fetchedUser.birthDate ? `${fetchedUser.birthDate} (${getAgeFromBirthDate(fetchedUser.birthDate)} tahun)` : ''}</div>
                      <div>{fetchedUser.lastEducation ?? ''}</div>
                      <ol>
                        {(fetchedUser.experience.length === 0) ? (
                          ''
                        ) : fetchedUser.experience.map((experience, index) => (
                          <li key={index} className='ml-4 list-disc'>{experience.namaPerusahaan} - ({new Date(experience.durasi.awal).toString().slice(4, 15)} - {new Date(experience.durasi.akhir).toString().slice(4, 15)}) (Rating: {experience.rating})</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};



export { Profile };

