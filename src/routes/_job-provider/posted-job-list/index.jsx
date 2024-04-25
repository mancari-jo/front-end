import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';



/**
 * Komponen untuk menampilkan daftar pekerjaan yang diposting oleh pengguna.
 */
const PostedJobList = () => {
  const { Nav, BurgerMenu } = Header();

  const navigate = useNavigate();

  const { id } = useSelector(state => state.user);

  const [jobList, setJobList] = useState(null);
  const [preferenceList, setPreferenceList] = useState([]);



  /**
   * Mengambil daftar pekerjaan yang diposting oleh pengguna.
   */
  useEffect(() => {
    getJobList();
    getPreferenceList();
  }, []);



  /**
   * Fungsi untuk mengambil daftar pekerjaan yang diposting oleh pengguna.
   */
  async function getJobList() {
    try {
      const res = await axios.get(`${BASE_URL}/job`);
      
      if (!res.data?.status) throw new Error();

      setJobList(res.data.data.filter(job => job.penerbit === id));
    } catch (err) {
      console.error('Unable to get job list: ', err);
    }
  }

  /**
   * Fungsi untuk mengambil daftar preferensi pekerjaan.
   */
  async function getPreferenceList() {
    try {
      const res = await axios.get(`${BASE_URL}/job-preferences`);
      
      if (!res.data?.status) throw new Error();

      setPreferenceList(res.data.data);
    } catch (err) {
      console.error('Unable to get job list: ', err);
    }
  }

  /**
   * Mengarahkan pengguna ke halaman detail pekerjaan ketika pekerjaan di-klik.
   * @param {string} id - ID pekerjaan.
   */
  function handleJobOnClick(id) {
    navigate(`/job-detail/${id}`);
  }



  return (
    <main className='bg-2 overflow-auto'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center'>
          <h1 className='text-lg sm:text-2xl font-bold text-center'>Daftar Pekerjaan</h1>

          <div className='mt-8 flex-1 w-full lg:max-w-4xl overflow-auto'>
            {!jobList ? (
              <h2 className='text-xl bg-background px-2 py-4 rounded-lg text-center'>Sedang memuat data ...</h2>
            ) : (jobList.length === 0) ? (
              <h2 className='text-xl bg-background px-2 py-4 rounded-lg text-center'>Kosong</h2>
            ) : (preferenceList.length > 0) && (
              <div className='flex flex-col gap-4 overflow-auto'>
                {jobList.map((job, index) => (
                  <div key={index} className='bg-background py-4 px-8 rounded-lg'>
                    {job.adaPelamarBaru && <p className='font-bold text-right'>Ada Pelamar Baru!</p>}
                    <p className='flex'>
                      <span className='w-40'>Nama Pekerjaan</span>
                      <span>:</span>
                      <span className='ml-2 flex-1'>{job.nama}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-40'>Preferensi</span>
                      <span>:</span>
                      <span className='ml-2 flex-1'>{preferenceList.filter(preference => job.preferensi.includes(preference._id)).map(preference => preference.nama).join(', ')}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-40'>Alamat</span>
                      <span>:</span>
                      <span className='ml-2 flex-1'>{job.lokasi.deskripsi}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-40'>Gaji</span>
                      <span>:</span>
                      <span className='ml-2 flex-1'>Rp. {job.gaji}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-40'>Jam Kerja</span>
                      <span>:</span>
                      <span className='ml-2 flex-1'>{job.jamKerja.awal} - {job.jamKerja.akhir}</span>
                    </p>

                    <div className='mt-2 flex justify-end'>
                      <div>
                        <Button onClick={() => handleJobOnClick(job._id)}>Lihat</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};



export { PostedJobList };

