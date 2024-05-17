import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';
import convertToProperSalaryString from '../../../utils/convertToProperSalaryString';



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
        <div className='flex-1 py-4 overflow-auto flex flex-col'>
          <h1 className='text-sm font-bold text-center'>Daftar Pekerjaan</h1>

          <div className='mt-4 flex-1 w-full overflow-auto'>
            {!jobList ? (
              <h2 className='text-xs bg-background px-1 py-2 rounded text-center'>Sedang memuat data ...</h2>
            ) : (jobList.length === 0) ? (
              <h2 className='text-xs bg-background px-1 py-2 rounded text-center'>Kosong</h2>
            ) : (preferenceList.length > 0) && (
              <div className='flex flex-col gap-4 overflow-auto'>
                {jobList.map((job, index) => (
                  <div key={index} className='bg-background py-2 px-4 rounded flex flex-col items-center'>
                    {job.adaPelamarBaru && <p className='font-bold text-right text-xs'>Ada Pelamar Baru!</p>}
                    <p className='flex'>
                      <span className='w-48'>Nama Pekerjaan</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>{job.nama}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-48'>Preferensi</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>{preferenceList.filter(preference => job.preferensi.includes(preference._id)).map(preference => preference.nama).join(', ')}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-48'>Alamat</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>{job.lokasi.deskripsi}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-48'>Gaji</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>Rp. {convertToProperSalaryString(job.gaji)}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-48'>Hari Kerja</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>{job?.hariKerja?.awal} - {job?.hariKerja?.akhir}</span>
                    </p>
                    <p className='flex'>
                      <span className='w-48'>Jam Kerja</span>
                      <span className='w-4'>:</span>
                      <span className='w-48'>{job.jamKerja.awal} - {job.jamKerja.akhir}</span>
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

