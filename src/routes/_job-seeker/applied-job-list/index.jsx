import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';

import { AppliedJobList as AppliedJobListLMAOIamTooTiredToThinkAboutNamingStuff } from './AppliedJobList';
import { DeclinedJobList } from './DeclinedJobList';



/**
 * Komponen untuk menampilkan daftar pekerjaan yang diposting oleh pengguna.
 */
const AppliedJobList = () => {
  const { Nav, BurgerMenu } = Header();

  const navigate = useNavigate();

  const { id } = useSelector(state => state.user);

  const [jobList, setJobList] = useState(null);
  const [preferenceList, setPreferenceList] = useState([]);
  const [appliedJoblist, setAppliedJobList] = useState([]);
  const [declinedJobList, setDeclinedJobList] = useState([]);



  /**
   * Mengambil daftar pekerjaan yang diposting oleh pengguna.
   */
  useEffect(() => {
    getJobList();
    getPreferenceList();
  }, []);
  
  useEffect(() => {
    if (jobList) {
      getAppliedJobList();
      getDeclinedJobList();
    }
  }, [jobList]);



  async function getJobList() {
    try {
      const res = await axios.get(`${BASE_URL}/job`);
      
      if (!res.data?.status) throw new Error();

      const newJobList = res.data.data;

      setJobList(newJobList);
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

  async function getAppliedJobList() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${id}`);
      
      if (!res.data?.status) throw new Error();
      
      const userAppliedJobsId = res.data.data.lamaran;
      const newAppliedJobList = jobList.filter(job => userAppliedJobsId.includes(job._id));
      
      setAppliedJobList(newAppliedJobList);
    } catch (err) {
      console.error('Unable to get applied job list: ', err);
    }
  }

  async function getDeclinedJobList() {
    try {
      const newDeclinedJobList = jobList.filter(job => job.ditolak.includes(id));

      console.log('newDeclinedJobList', newDeclinedJobList);
      setDeclinedJobList(newDeclinedJobList);
    } catch (err) {
      console.error('Unable to get declined job list: ', err);
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
        <div className='flex-1 py-4 overflow-auto flex flex-col gap-4'>
          <AppliedJobListLMAOIamTooTiredToThinkAboutNamingStuff preferenceList={preferenceList} jobList={appliedJoblist} handleJobOnClick={handleJobOnClick} />
          <DeclinedJobList preferenceList={preferenceList} jobList={declinedJobList} handleJobOnClick={handleJobOnClick} />
        </div>
      </div>
    </main>
  );
};



export { AppliedJobList };

