import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';



/**
 * Fungsi untuk mengubah tanggal dalam format ISO ke format string yang dapat dibaca.
 * @param {string} ISOStringDate - Tanggal dalam format ISO.
 * @returns {string} Tanggal dalam format string yang dapat dibaca.
 */
function convertISOStringDateToStringDate(ISOStringDate) {
  const date = new Date(ISOStringDate);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}



/**
 * Komponen untuk menampilkan detail pekerjaan.
 */
const JobDetail = () => {
  const { Nav, BurgerMenu } = Header();

  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const { id: userId } = useSelector(state => state.user);

  const [job, setJob] = useState(null);
  const [creator, setCreator] = useState(null);
  const [preferenceList, setPreferenceList] = useState([]);
  const [hasUserApplied, setHasUserApplied] = useState(false);
  const [isUserAccepted, setIsUserAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  /**
   * Mengambil data pekerjaan berdasarkan ID ketika komponen telah dimuat.
   */
  useEffect(() => {
    if (jobId) {
      getJob();
      getPreferenceList();
    }
  }, [jobId]);

  /**
   * Mengambil pembuat pekerjaan setelah pekerjaan telah diambil.
   */
  useEffect(() => {
    if (job) getCreator();
  }, [job]);

  /**
   * Memeriksa apakah pengguna telah melamar pekerjaan setelah pekerjaan dan ID pengguna telah diambil.
   */
  useEffect(() => {
    if (job && userId) {
      checkIfUserAlreadyApply();
      checkIfUserIsAccepted();
    }
  }, [job, userId]);



  /**
   * Mengambil detail pekerjaan berdasarkan ID.
   */
  async function getJob() {
    try {
      const res = await axios.get(`${BASE_URL}/job/${jobId}`);
      
      if (!res.data?.status) throw new Error();

      if (res.data.data.status === 'closed') {
        navigate(-1);
        return;
      }

      setJob(res.data.data);
    } catch (err) {
      console.error('Unable to get job list: ', err);
      navigate(-1);
    }
  }

  /**
   * Mengambil daftar preferensi pekerjaan.
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
   * Mengambil data pembuat pekerjaan.
   */
  async function getCreator() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${job.penerbit}`);
      
      if (!res.data?.status) throw new Error();

      setCreator(res.data.data);
    } catch (err) {
      console.error('Unable to get creator: ', err);
    }
  }

  /**
   * Memeriksa apakah pengguna telah melamar pekerjaan.
   */
  function checkIfUserAlreadyApply() {
    if (job.pelamar.find(pelamar => pelamar._id === userId)) setHasUserApplied(true);
  }

  /**
   * Memeriksa apakah pengguna telah diterima di pekerjaan.
   */
  function checkIfUserIsAccepted() {
    if (job.diterima.find(pelamar => pelamar.idPelamar === userId)) setIsUserAccepted(true);
  }

  /**
   * Menangani aksi ketika tombol 'Apply' diklik.
   */
  async function handleApplyOnClick() {
    try {
      setIsSubmitting(true);

      const user = await getUser();
      const newUser = {
        ...user,
        lamaran: [...user.lamaran, job._id]
      };

      const newJob = {
        ...job,
        pelamar: [...job.pelamar, {
          _id: user._id,
          tanggal: new Date().toISOString()
        }],
        adaPelamarBaru: true,
      };

      await patchUser(newUser);
      await patchJob(newJob);

      navigate(-1);
    } catch (err) {
      console.error('Unable to apply: ', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Mengambil data pengguna berdasarkan ID.
   */
  async function getUser() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${userId}`);
      
      if (!res.data?.status) throw new Error();

      return res.data.data;
    } catch (err) {
      console.error('Unable to get creator: ', err);
    }
  }

  /**
   * Memperbarui data pengguna.
   * @param {object} newUser - Data pengguna yang diperbarui.
   */
  async function patchUser(newUser) {
    try {
      const res = await axios.patch(`${BASE_URL}/user/${newUser._id}`, newUser);
      
      if (!res.data?.status) throw new Error();
    } catch (err) {
      console.error('Unable to patch user: ', err);
    }
  }

  /**
   * Memperbarui data pekerjaan.
   * @param {object} newJob - Data pekerjaan yang diperbarui.
   */
  async function patchJob(newJob) {
    try {
      const res = await axios.patch(`${BASE_URL}/job/${newJob._id}`, newJob);
      
      if (!res.data?.status) throw new Error();
    } catch (err) {
      console.error('Unable to patch job: ', err);
    }
  }



  return (
    <main className='bg-2 overflow-auto'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center'>
          <h1 className='text-lg sm:text-2xl font-bold text-center'>Detail Pekerjaan</h1>

          <div className='mt-8 flex-1 w-full lg:max-w-4xl overflow-auto'>
            {(!job || !creator) ? (
              <h2 className='text-xl bg-background px-2 py-4 rounded-lg text-center'>Sedang memuat data ...</h2>
            ) : (
              <div className='bg-background py-4 px-8 rounded-lg overflow-auto'>
                <p className='flex'>
                  <span className='w-40'>Penerbit</span>
                  <span>:</span>
                  <span className='ml-2 flex-1'>{creator.nama}</span>
                </p>
                <p className='flex'>
                  <span className='w-40'>Tanggal Terbit</span>
                  <span>:</span>
                  <span className='ml-2 flex-1'>{convertISOStringDateToStringDate(job.tanggalTerbit)}</span>
                </p>
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
                <p className='flex'>
                  <span className='w-40'>Syarat</span>
                  <span>:</span>
                  <span className='ml-2 flex-1'>{job.syarat}</span>
                </p>
                <p className='flex'>
                  <span className='w-40'>Status</span>
                  <span>:</span>
                  <span className='ml-2 flex-1'>{(job.status === 'open') ? 'Dibuka' : 'Ditutup'}</span>
                </p>

                <div className='mt-2 flex justify-end'>
                  <div className='flex gap-2'>
                    <Button theme={hasUserApplied ? 'danger' : isUserAccepted ? 'secondary' : 'primary'} onClick={handleApplyOnClick} disabled={isSubmitting || hasUserApplied || isUserAccepted}>{hasUserApplied ? 'Anda sudah melamar di pekerjaan ini' : isUserAccepted ? 'Anda sudah diterima di pekerjaan ini' : 'Apply'}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};



export { JobDetail };

