import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { search } from '../../assets/svg';
import { Button } from '../../components/button';
import { Header } from '../../components/header';
import { BASE_URL } from '../../constants';



/**
 * Komponen untuk menampilkan daftar pekerjaan yang tersedia.
 */
const JobList = () => {
  const { Nav, BurgerMenu } = Header();

  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobList, setJobList] = useState(null);
  const [recommendedJobList, setRecommendedJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);



  /**
   * Mengambil daftar pekerjaan dari server saat komponen dimuat.
   */
  useEffect(() => {
    getJobList();
  }, []);

  /**
   * Mengupdate daftar pekerjaan yang telah difilter berdasarkan query pencarian.
   */
  useEffect(() => {
    if (jobList) {
      if (searchQuery) setFilteredJobList(jobList.filter(job => job.nama.includes(searchQuery)));
      else setFilteredJobList([]);
    }
  }, [jobList, searchQuery]);

  /**
   * Mengambil daftar pekerjaan yang direkomendasikan untuk pengguna saat pengguna sudah masuk dan daftar pekerjaan sudah dimuat.
   */
  useEffect(() => {
    if (user && jobList) {
      getRecommendedJobList();
    }
  }, [user, jobList]);



  /**
   * Mengambil daftar pekerjaan dari server.
   */
  async function getJobList() {
    try {
      const res = await axios.get(`${BASE_URL}/job`);

      if (!res.data?.status) throw new Error();
      
      setJobList(res.data.data.filter(job => job.status === 'open'));
    } catch (err) {
      console.error('Unable to get job list: ', err);
    }
  }

  /**
   * Mengambil daftar pekerjaan yang direkomendasikan untuk pengguna berdasarkan preferensi pengguna.
   */
  async function getRecommendedJobList() {
    const newRecommendedJobList = [];

    // filter using job seeker preference first
    try {
      if (user.role === 'jobSeeker') {
        const res = await axios.get(`${BASE_URL}/user/${user.id}`);
  
        if (!res.data?.status) throw new Error();

        const fetchedUserData = res.data.data;

        jobList.forEach(job => {
          if (
            (job.preferensi.filter(preferensi => fetchedUserData.preferensiPekerjaan.includes(preferensi))) &&
            (newRecommendedJobList.length < 6)
          ) {
            newRecommendedJobList.push(job);
          }
        });
      }
    } catch (err) {
      console.error('Unable to get user data: ', err);
    }
    
    setRecommendedJobList(newRecommendedJobList);
  }

  /**
   * Menangani ketika pekerjaan pada daftar dipilih.
   * @param {string} id - ID pekerjaan yang dipilih.
   */
  function handleJobOnPress(id) {
    if (!user) navigate('/sign-in');
    else navigate(`/job-detail/${id}`);
  }



  return (
    <main className='bg-2 overflow-auto'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='flex-1 flex flex-col items-center overflow-auto px-4'>
          {!jobList ? (
            <div className='w-full h-full flex items-center justify-center'>
              <h1 className='text-2xl'>Sedang memuat pekerjaan ...</h1>
            </div>
          ) : (jobList.length === 0) ? (
            <div className='w-full h-full flex items-center justify-center'>
              <h1 className='text-2xl'>Tidak ada pekerjaan yang tersedia</h1>
            </div>
          ) : (
            (
              <>
                {/* search query */}
                <div className='mt-16 w-full lg:max-w-4xl'>
                  <h1 className='font-bold text-xl text-center'>Cari Lowongan Pekerjaan</h1>
                  <div className='flex mt-2'>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className='flex-1 text-xl px-4 rounded-tl-lg rounded-bl-lg' />
                    <button className='bg-primary p-2 rounded-tr-lg rounded-br-lg'>
                      <img src={search} alt='' className='h-12 w-12' />
                    </button>
                  </div>
                </div>

                {(!searchQuery && filteredJobList.length === 0) ? (
                  <div className='mt-32 w-full lg:max-w-4xl flex flex-col items-center'>
                    <h2 className='font-bold text-lg text-center'>Rekomendasi Pekerjaan</h2>
                    <div className='mt-2 grid grid-cols-2 gap-4 w-full md:w-1/2'>
                      {recommendedJobList.map((job, index) => (
                        <div key={index}>
                          <button onClick={() => handleJobOnPress(job._id)} className='py-2 px-4 rounded-lg w-full bg-background'>{job.nama}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (searchQuery && filteredJobList.length === 0) ? (
                  <h2 className='mt-32 font-bold text-lg text-center'>Pekerjaan yang dicari tidak ditemukan</h2>
                ) : (
                  <div className='mt-32 mb-8 w-full lg:max-w-4xl flex flex-col gap-4 overflow-auto'>
                    {filteredJobList.map((job, index) => (
                      <div key={index} className='bg-background py-2 px-4 rounded-lg flex items-center'>
                        <div className='flex-1'>
                          <h3 className='text-lg'>{job.nama}</h3>
                          <p className='flex'>
                            <span className='w-20'>Deskripsi</span>
                            <span>:</span>
                            <span className='ml-2 flex-1'>{job.syarat}</span>
                          </p>
                        </div>
                        <div>
                          <Button onClick={() => handleJobOnPress(job._id)}>Lihat</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </main>
  );
};



export { JobList };

