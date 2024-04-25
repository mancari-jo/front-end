import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';

import { StopEmployeeModal } from './StopEmployeeModal';



/**
 * Komponen untuk menampilkan detail pekerjaan.
 * 
 * @returns {JSX.Element} Komponen React untuk menampilkan detail pekerjaan.
 */
function convertISOStringDateToStringDate(ISOStringDate) {
  const date = new Date(ISOStringDate);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}



const JobDetail = () => {
  const { Nav, BurgerMenu } = Header();

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [preferenceList, setPreferenceList] = useState([]);
  const [stoppedEmployeeList, setStoppedEmployeeList] = useState([]);
  const [workingEmployeeList, setWorkingEmployeeList] = useState([]);
  const [applicantList, setApplicantList] = useState([]);
  const [selectedEmployeeToBeStopped, setSelectedEmployeeToBeStopped] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Mengambil detail pekerjaan dan daftar preferensi jika ID pengguna tersedia.
   */
  useEffect(() => {
    if (id) {
      getJob();
      getPreferenceList();
    }
  }, [id]);

  /**
   * Memperbarui daftar pelamar, daftar pekerja yang berhenti, dan daftar pekerja yang sedang bekerja
   * jika pekerjaan tersedia.
   */
  useEffect(() => {
    if (job) {
      if (job.diterima.length > 0) {
        getStoppedEmployeeList();
        getWorkingEmployeeList();
      }
      if (job.pelamar.length > 0) getApplicantList();
      if (job.adaPelamarBaru) removeNewApplicantNotification();
    }
  }, [job]);



  /**
   * Mengambil daftar pekerjaan.
   */
  async function getJob() {
    try {
      const res = await axios.get(`${BASE_URL}/job/${id}`);
      
      if (!res.data?.status) throw new Error();

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
   * Mengambil daftar karyawan yang berhenti untuk pekerjaan saat ini.
   */
  async function getStoppedEmployeeList() {
    try {
      const promises = job.diterima.filter(employee => employee.statusKerja === 'stopped').map(employee => axios.get(`${BASE_URL}/user/${employee.idPelamar}`));
      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        if (!res.data?.status) throw new Error();
      });

      setStoppedEmployeeList(responses.map(res => res.data.data));
    } catch (err) {
      console.error('Unable to get stopped employee list: ', err);
    }
  }
  
  /**
   * Mengambil daftar karyawan yang sedang bekerja untuk pekerjaan saat ini.
   */
  async function getWorkingEmployeeList() {
    try {
      const promises = job.diterima.filter(employee => employee.statusKerja === 'working').map(employee => axios.get(`${BASE_URL}/user/${employee.idPelamar}`));
      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        if (!res.data?.status) throw new Error();
      });

      setWorkingEmployeeList(responses.map(res => res.data.data));
    } catch (err) {
      console.error('Unable to get working employee list: ', err);
    }
  }

  /**
   * Mengambil daftar pelamar untuk pekerjaan saat ini.
   */
  async function getApplicantList() {
    try {
      const promises = job.pelamar.map(pelamar => axios.get(`${BASE_URL}/user/${pelamar._id}`));
      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        if (!res.data?.status) throw new Error();
      });

      setApplicantList(responses.map(res => res.data.data));
    } catch (err) {
      console.error('Unable to get applicant list: ', err);
    }
  }

  /**
   * Menghapus notifikasi pelamar baru untuk pekerjaan saat ini.
   */
  async function removeNewApplicantNotification() {
    try {
      const payload = {
        ...job,
        adaPelamarBaru: false
      };

      const res = await axios.patch(`${BASE_URL}/job/${id}`, payload);
      
      if (!res.data?.status) throw new Error();

      getJob();
    } catch (err) {
      console.error('Unable to patch job applicant notification: ', err);
    }
  }

  /**
   * Mengubah status pekerjaan saat ini antara dibuka dan ditutup.
   */
  async function toggleJobStatus() {
    try {
      setIsFormSubmitting(true);

      const payload = {
        ...job,
        status: (job.status === 'open') ? 'closed' : 'open'
      };

      const res = await axios.patch(`${BASE_URL}/job/${id}`, payload);
      
      if (!res.data?.status) throw new Error();

      getJob();
    } catch (err) {
      console.error('Unable to patch job status: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Navigasi ke halaman profil dari pengguna yang diberikan.
   * @param {Object} user Objek pengguna yang berisi detail pengguna.
   */
  function handleUserProfileOnClick(user) {
    navigate(`/profile/${user._id}`);
  }

  /**
   * Mengatur karyawan yang dipilih untuk dihentikan.
   * @param {Object} employee Objek karyawan yang akan dihentikan.
   */
  function handleEmployeeOnStop(employee) {
    setSelectedEmployeeToBeStopped(employee);
  }

  /**
   * Menghentikan karyawan yang dipilih dengan rating yang diberikan.
   * @param {number} rating Rating yang diberikan kepada karyawan.
   */
  async function stopEmployee(rating) {
    try {
      setIsFormSubmitting(true);

      if (!rating) return;

      const companyName = await getUserName();

      const newUser = {
        ...selectedEmployeeToBeStopped,
        pengalamanKerja: [...selectedEmployeeToBeStopped.pengalamanKerja, {
          namaPerusahaan: companyName,
          durasi: {
            awal: job.diterima.find(employee => employee.idPelamar === selectedEmployeeToBeStopped._id).tanggal,
            akhir: new Date().toISOString(),
          },
          rating
        }]
      };


      const newJob = {
        ...job,
        diterima: job.diterima.map(pelamar => {
          if (pelamar.idPelamar === selectedEmployeeToBeStopped._id) {
            return {
              ...pelamar,
              statusKerja: 'stopped'
            };
          } else {
            return pelamar;
          }
        })
      };

      await patchUser(newUser);
      await patchJob(newJob);
      await getJob();
    } catch (err) {
      console.error('Unable to stop employee: ', err);
    } finally {
      setIsFormSubmitting(false);
      setSelectedEmployeeToBeStopped(false);
    }
  }

  /**
   * Mengambil nama pengguna terkait dengan pekerjaan saat ini.
   * @returns {string} Nama pengguna.
   */
  async function getUserName() {
    try {
      setIsFormSubmitting(true);

      const res = await axios.get(`${BASE_URL}/job/${id}`);
      
      if (!res.data?.status) throw new Error();

      return res.data.data.nama;
    } catch (err) {
      console.error('Unable to get user name: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Menangani penolakan pelamar untuk pekerjaan saat ini.
   * @param {Object} applicant Objek pelamar yang akan ditolak.
   */
  async function handleApplicantDeclineOnClick(applicant) {
    try {
      setIsFormSubmitting(true);

      const newUser = {
        ...applicant,
        lamaran: applicant.lamaran.filter(lamaran => lamaran !== id)
      };

      const newJob = {
        ...job,
        pelamar: job.pelamar.filter(thisJob => thisJob._id !== applicant._id)
      };

      await patchUser(newUser);
      await patchJob(newJob);
      await getJob();
    } catch (err) {
      console.error('Unable to decline applicant: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Menangani penerimaan pelamar untuk pekerjaan saat ini.
   * @param {Object} applicant Objek pelamar yang akan diterima.
   */
  async function handleApplicantAcceptOnClick(applicant) {
    try {
      setIsFormSubmitting(true);

      const newUser = {
        ...applicant,
        lamaran: applicant.lamaran.filter(lamaran => lamaran !== id)
      };

      const newJob = {
        ...job,
        pelamar: job.pelamar.filter(thisJob => thisJob._id !== applicant._id),
        diterima: [...job.diterima, {
          idPelamar: applicant._id,
          pesanNotifikasi: `Selamat anda diterima untuk bekerja sebagai ${job.nama}.`,
          statusBacaNotifikasi: false,
          statusKerja: 'working',
          tanggal: new Date().toISOString()
        }]
      };

      await patchUser(newUser);
      await patchJob(newJob);
      await getJob();
    } catch (err) {
      console.error('Unable to accept applicant: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Memperbarui informasi pengguna dengan data yang baru.
   * @param {Object} newUser Objek pengguna dengan data yang baru.
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
   * Memperbarui informasi pekerjaan dengan data yang baru.
   * @param {Object} newJob Objek pekerjaan dengan data yang baru.
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
    <>
      <main className='bg-2 overflow-auto'>
        {Nav}
        <div className='flex-1 relative flex overflow-auto'>
          {BurgerMenu}
          <div className='flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center'>
            <h1 className='text-lg sm:text-2xl font-bold text-center'>Detail Pekerjaan</h1>

            <div className='mt-8 flex-1 w-full lg:max-w-4xl overflow-auto'>
              {!job ? (
                <h2 className='text-xl bg-background px-2 py-4 rounded-lg text-center'>Sedang memuat data ...</h2>
              ) : (
                <div className='bg-background py-4 px-8 rounded-lg h-full overflow-auto'>
                  {job.adaPelamarBaru && <p className='font-bold text-right'>Ada Pelamar Baru!</p>}

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

                  <div className='mt-16 flex justify-end'>
                    <div>
                      <Button theme={job.status === 'open' ? 'danger' : 'primary'} onClick={toggleJobStatus} disabled={isFormSubmitting}>{job.status === 'open' ? 'Tutup' : 'Buka'} Pekerjaan</Button>
                    </div>
                  </div>

                  <div className='mt-16'>
                    <h2 className='border-b-2 border-black text-xl'>Daftar Karyawan yang sudah berhenti</h2>
                    <div className='mt-4 flex flex-col gap-4'>
                      {(stoppedEmployeeList.length === 0) ? (
                        <h2 className='text-xl text-center'>Kosong</h2>
                      ) : stoppedEmployeeList.map((employee, index) => (
                        <div key={index} className='py-2 px-4 rounded-lg' style={{backgroundColor: '#C6C7C9'}}>
                          <p className='flex'>
                            <span className='w-16'>Nama</span>
                            <span>:</span>
                            <span className='ml-2 flex-1'>{employee.nama}</span>
                          </p>
                          <div className='mt-2 flex justify-end'>
                            <div className='flex gap-2'>
                              <Button theme='secondary' onClick={() => handleUserProfileOnClick(employee)} disabled={isFormSubmitting}>Profil</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='mt-16'>
                    <h2 className='border-b-2 border-black text-xl'>Daftar Karyawan yang sedang bekerja</h2>
                    <div className='mt-4 flex flex-col gap-4'>
                      {(workingEmployeeList.length === 0) ? (
                        <h2 className='text-xl text-center'>Kosong</h2>
                      ) : workingEmployeeList.map((employee, index) => (
                        <div key={index} className='py-2 px-4 rounded-lg' style={{backgroundColor: '#C6C7C9'}}>
                          <p className='flex'>
                            <span className='w-16'>Nama</span>
                            <span>:</span>
                            <span className='ml-2 flex-1'>{employee.nama}</span>
                          </p>
                          <div className='mt-2 flex justify-end'>
                            <div className='flex gap-2'>
                              <Button theme='secondary' onClick={() => handleUserProfileOnClick(employee)} disabled={isFormSubmitting}>Profil</Button>
                              <Button theme='danger' onClick={() => handleEmployeeOnStop(employee)} disabled={isFormSubmitting}>Hentikan</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='mt-16'>
                    <h2 className='border-b-2 border-black text-xl'>Daftar Pelamar</h2>
                    <div className='mt-4 flex flex-col gap-4'>
                      {(applicantList.length === 0) ? (
                        <h2 className='text-xl text-center'>Kosong</h2>
                      ) : applicantList.map((applicant, index) => (
                        <div key={index} className='py-2 px-4 rounded-lg' style={{backgroundColor: '#C6C7C9'}}>
                          <p className='flex'>
                            <span className='w-16'>Nama</span>
                            <span>:</span>
                            <span className='ml-2 flex-1'>{applicant.nama}</span>
                          </p>
                          <div className='mt-2 flex justify-end'>
                            <div className='flex gap-2'>
                              <Button theme='secondary' onClick={() => handleUserProfileOnClick(applicant)} disabled={isFormSubmitting}>Profil</Button>
                              <Button theme='danger' onClick={() => handleApplicantDeclineOnClick(applicant)} disabled={isFormSubmitting}>Tolak</Button>
                              <Button onClick={() => handleApplicantAcceptOnClick(applicant)} disabled={isFormSubmitting}>Terima</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedEmployeeToBeStopped && <StopEmployeeModal stopEmployee={stopEmployee} />}
    </>
  );
};



export { JobDetail };

