import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { defaultProfilePicture } from '../../assets/img';
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
  const { searchJobQuery } = useSelector(state => state.app);

  const [testimonyList, setTestimonyList] = useState([]);
  const [jobList, setJobList] = useState(null);
  const [newestJobList, setNewestJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);



  /**
   * Mengambil daftar pekerjaan dari server saat komponen dimuat.
   */
  useEffect(() => {
    getJobList();
    getTestimonyList();
  }, []);

  /**
   * Mengupdate daftar pekerjaan yang telah difilter berdasarkan query pencarian.
   */
  useEffect(() => {
    if (jobList) {
      if (searchJobQuery) setFilteredJobList(jobList.filter(job => job.nama.toLowerCase().includes(searchJobQuery.toLowerCase())));
      else setFilteredJobList([]);
    }
  }, [jobList, searchJobQuery]);

  /**
   * Mengambil daftar pekerjaan yang terbaru untuk pengguna saat pengguna sudah masuk dan daftar pekerjaan sudah dimuat.
   */
  useEffect(() => {
    if (jobList) getNewestJobList();
  }, [jobList]);



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

  async function getTestimonyList() {
    try {
      const res = await axios.get(`${BASE_URL}/user`);
      
      if (!res.data?.status) throw new Error();
      
      const newTestimonyList = res.data.data
        .filter(user => user.testimoni)
        .map(user => ({
          by: user.nama,
          content: user.testimoni,
          profilePicture: user.fotoProfil
        }));
      
      setTestimonyList(newTestimonyList);
    } catch (err) {
      console.error('Unable to get testimony list: ', err);
    }
  }

  /**
   * Mengambil daftar pekerjaan yang terbaru untuk pengguna berdasarkan preferensi pengguna.
   */
  async function getNewestJobList() {
    const sortedJobList = jobList.sort((a, b) => new Date(b.tanggalTerbit) - new Date(a.tanggalTerbit));
    const sixFirstJobList = sortedJobList.slice(0, 6);
    
    setNewestJobList(sixFirstJobList);
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
        <div className='flex-1 flex flex-col justify-between overflow-auto p-4 gap-4'>
          {!jobList ? (
            <div className='flex-1 flex items-center justify-center'>
              <h1 className='text-base'>Sedang memuat pekerjaan ...</h1>
            </div>
          ) : (jobList.length === 0) ? (
            <div className='flex-1 flex items-center justify-center'>
              <h1 className='text-base'>Tidak ada pekerjaan yang tersedia</h1>
            </div>
          ) : (
            <>
              <div>
                <h1 className='font-bold text-xs text-center'>Pengenalan Aplikasi</h1>
                <h2 className='text-xs text-center'>Mancari Jo adalah sebuah sistem informasi bursa kerja berbasis web yang dirancang untuk melayani masyarakat di Minahasa Utara. Platform ini bertujuan untuk menghubungkan para pencari kerja dengan berbagai peluang pekerjaan yang tersedia di wilayah tersebut, sekaligus membantu perusahaan dan organisasi dalam menemukan kandidat yang sesuai dengan kebutuhan mereka.</h2>
              </div>
              
              {(!searchJobQuery && filteredJobList.length === 0) ? (
                <div className='w-full flex justify-center'>
                  <div className='w-3/4 flex flex-col items-center'>
                    <h2 className='font-bold text-base text-center'>Pekerjaan Terbaru</h2>
                    <div className='mt-2 grid grid-cols-2 gap-2 w-full'>
                      {newestJobList.map((job, index) => (
                        <div key={index}>
                          <button onClick={() => handleJobOnPress(job._id)} className='py-1 px-2 rounded w-full bg-background'>{job.nama}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (searchJobQuery && filteredJobList.length === 0) ? (
                <h2 className='font-bold text-base text-center'>Pekerjaan yang dicari tidak ditemukan</h2>
              ) : (
                <div className='w-full flex flex-col gap-2 overflow-auto'>
                  {filteredJobList.map((job, index) => (
                    <div key={index} className='bg-background py-1 px-2 rounded flex items-center'>
                      <div className='flex-1'>
                        <h3 className='text-sm'>{job.nama}</h3>
                        <p className='flex text-xs'>
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

              <div className='w-full'>
                {(testimonyList.length > 0) && (
                  <>
                    <h1 className='font-bold text-base text-center'>Testimoni</h1>
                    <div className='flex mt-1 gap-2 overflow-auto'>
                      {testimonyList.map((testimony, index) => (
                        <div key={index} className='bg-background rounded p-2'>
                          <div className='flex items-center gap-1 w-40'>
                            <img
                              className='h-8 w-8 rounded-full'
                              src={testimony.profilePicture ?? defaultProfilePicture}
                              alt='profile'
                            />
                            <div className='text-xs font-bold'>{testimony.by}</div>
                          </div>
                          <p className='text-xs'>{testimony.content}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};



export { JobList };

