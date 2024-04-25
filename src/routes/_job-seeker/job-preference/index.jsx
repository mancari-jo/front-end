import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { BASE_URL } from '../../../constants';



/**
 * Komponen untuk mengelola preferensi pekerjaan pengguna.
 */
const JobPreference = () => {
  const { Nav, BurgerMenu } = Header();

  const navigate = useNavigate();

  const { id } = useSelector(state => state.user);

  const [user, setUser] = useState(null);
  const [allPreferences, setAllPreferences] = useState([]);
  const [userJobPreferences, setUserJobPreferences] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Mengambil data pengguna dan daftar preferensi pekerjaan ketika komponen telah dimuat.
   */
  useEffect(() => {
    getUser();
    getAllPreferences();
  }, []);

  /**
   * Memperbarui preferensi pekerjaan pengguna setelah pengguna atau preferensi pekerjaan telah diambil.
   */
  useEffect(() => {
    if (user && (allPreferences.length > 0)) {
      setUserJobPreferences(allPreferences.filter(preference => user.preferensiPekerjaan.includes(preference.id)))
    }
  }, [user, allPreferences]);



  /**
   * Mengambil data pengguna berdasarkan ID pengguna.
   */
  async function getUser() {
    try {
      const res = await axios.get(`${BASE_URL}/user/${id}`);
      
      if (!res.data?.status) throw new Error();

      setUser(res.data.data);
    } catch (err) {
      console.error('Unable to get user data: ', err);
    }
  }
  
  /**
   * Mengambil daftar semua preferensi pekerjaan.
   */
  async function getAllPreferences() {
    try {
      const res = await axios.get(`${BASE_URL}/job-preferences`);

      if (!res.data?.status) throw new Error();
      
      setAllPreferences(res.data.data.map(preference => ({ id: preference._id, label: preference.nama })));
    } catch (err) {
      console.error('Unable to get all preferences: ', err);
    }
  }

  /**
   * Menangani submit form untuk mengatur preferensi pekerjaan pengguna.
   * @param {object} e - Objek event form submit.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setIsFormSubmitting(true);
      
      const isNewPreferenceExist = userJobPreferences.some(preference => preference.isNew === true);
      
      if (isNewPreferenceExist) {
        const updatedPreferences = await submitNewPreference();
        if (!updatedPreferences) throw new Error('Unable to submit new preference: ');
        setUserJobPreferences(updatedPreferences);
        await submitNewUserPreference(updatedPreferences);
        
        return;
      }
      
      await submitNewUserPreference(userJobPreferences);
    } catch (err) {
      console.error('Unable to to submit: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Mengirim preferensi pekerjaan baru ke server.
   * @returns {Promise} - Resolved promise berisi preferensi pekerjaan yang telah diperbarui.
   */
  async function submitNewPreference() {
    try {
      const newPreferences = userJobPreferences.filter(preference => preference.isNew === true).map(preference => preference.label);

      const postNewPreferences = newPreferences.map(async (preference) => {
        const payload = {
          nama: preference
        };

        const res = await axios.post(`${BASE_URL}/job-preferences`, payload);

        return res.data.data;
      });
      
      const submittedPreferences = await Promise.all(postNewPreferences);

      const updatedPreferences = userJobPreferences.map(preference => {
        if (preference.isNew === true) {
          const submittedPreference = submittedPreferences.find(thisPreference => thisPreference.nama === preference.label);
          if (submittedPreference) return { ...preference, id: submittedPreference._id, isNew: undefined };
        }

        return preference;
      });


      await getAllPreferences();

      return updatedPreferences;
    } catch (err) {
      console.error('Unable to post new preference', err);
    }
  }

  /**
   * Mengirim preferensi pekerjaan pengguna yang telah diperbarui ke server.
   * @param {array} thisPreferences - Preferensi pekerjaan pengguna yang telah diperbarui.
   */
  async function submitNewUserPreference(thisPreferences) {
    try {
      const payload = {
        ...user,
        preferensiPekerjaan: thisPreferences.map(preference => preference.id)
      };
      
      const res = await axios.patch(`${BASE_URL}/user/${id}`, payload);
      
      if (!res.data?.status) throw new Error();
      
      navigate(-1);
    } catch (err) {
      console.error('Unable to patch user preference: ', err);
    }
  }



  return (
    <main className='bg-2'>
      {Nav}
      <div className='flex-1 relative flex'>
        {BurgerMenu}
        <div className='flex-1 flex flex-col items-center overflow-auto p-8'>
          {!user ? (
            <h1 className='text-xl text-center'>Sedang memuat data pengguna ...</h1>
          ) : (
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
              <CreatableSelect
                value={userJobPreferences.map(preference => ({ value: preference.id, label: preference.label }))}
                onChange={arrOfObj => setUserJobPreferences(arrOfObj.map(obj => ({ id: obj.value, label: obj.label, isNew: obj.__isNew__ })))}
                isMulti
                options={allPreferences.map(preference => ({ value: preference.id, label: preference.label }))}
                placeholder='Preferensi'
                formatCreateLabel={inputValue => `Tambah '${inputValue}'`}
                isDisabled={isFormSubmitting}
                required
              />

              <Button type='submit'>Atur Preferensi</Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};



export { JobPreference };

