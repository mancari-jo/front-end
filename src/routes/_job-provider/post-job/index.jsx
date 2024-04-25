import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { Button } from '../../../components/button';
import { Header } from '../../../components/header';
import { Input } from '../../../components/input';
import { BASE_URL } from '../../../constants';



/**
 * Komponen untuk menambahkan pekerjaan baru.
 */
const PostJob = () => {
  const { Nav, BurgerMenu } = Header();

  const navigate = useNavigate();

  const { id } = useSelector(state => state.user);

  const [allPreferences, setAllPreferences] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [name, setName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [startWorkingHour, setStartWorkingHour] = useState('');
  const [startWorkingMinute, setStartWorkingMinute] = useState('');
  const [endWorkingHour, setEndWorkingHour] = useState('');
  const [endWorkingMinute, setEndWorkingMinute] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Mengambil semua preferensi pekerjaan dari server.
   */
  useEffect(() => {
    getAllPreferences();
  }, []);



  /**
   * Mengambil semua preferensi pekerjaan dari server.
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
   * Menangani penyerahan formulir pekerjaan baru.
   * @param {Event} e Objek event formulir.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || (preferences.length === 0) || !requirements || !address || !salary || startWorkingHour === '' || startWorkingHour > 23 || startWorkingMinute === '' || startWorkingMinute > 59 || endWorkingHour === '' || endWorkingHour > 23 || endWorkingMinute === '' || endWorkingMinute > 59 || startWorkingHour > endWorkingHour) return;
    
    try {
      setIsFormSubmitting(true);
      
      const isNewPreferenceExist = preferences.some(preference => preference.isNew === true);
      
      if (isNewPreferenceExist) {
        const updatedPreferences = await submitNewPreference();
        if (!updatedPreferences) throw new Error('Unable to submit new preference: ');
        setPreferences(updatedPreferences);
        await submitNewJob(updatedPreferences);
        
        return;
      }
      
      await submitNewJob(preferences);
    } catch (err) {
      console.error('Unable to to submit: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Menyerahkan preferensi baru untuk pekerjaan.
   * @returns {Array} Preferensi yang telah diperbarui.
   */
  async function submitNewPreference() {
    try {
      const newPreferences = preferences.filter(preference => preference.isNew === true).map(preference => preference.label);

      const postNewPreferences = newPreferences.map(async (preference) => {
        const payload = {
          nama: preference
        };

        const res = await axios.post(`${BASE_URL}/job-preferences`, payload);

        return res.data.data;
      });
      
      const submittedPreferences = await Promise.all(postNewPreferences);

      const updatedPreferences = preferences.map(preference => {
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
   * Menyerahkan pekerjaan baru ke server.
   * @param {Array} thisPreferences Preferensi pekerjaan.
   */
  async function submitNewJob(thisPreferences) {
    try {
      const payload = {
        penerbit: id,
        tanggalTerbit: new Date().toISOString(),
        nama: name,
        preferensi: thisPreferences.map(preference => preference.id),
        syarat: requirements,
        lokasi: {
          deskripsi: address
        },
        gaji: parseInt(salary),
        jamKerja: {
          awal: `${startWorkingHour}:${startWorkingMinute}`,
          akhir: `${endWorkingHour}:${endWorkingMinute}`
        },
        pelamar: [],
        diterima: [],
        adaPelamarBaru: false
      };
      
      const res = await axios.post(`${BASE_URL}/job`, payload);
      
      if (!res.data?.status) throw new Error();
      
      navigate('/posted-job-list');
    } catch (err) {
      console.error('Unable to post job: ', err);
    }
  }



  return (
    <main className='bg-2'>
      {Nav}
      <div className='flex-1 relative flex'>
        {BurgerMenu}
        <div className='flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center'>
          <h1 className='text-lg sm:text-2xl font-bold text-center'>Tambah Pekerjaan</h1>

          <form onSubmit={handleSubmit} className='mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-4 w-full lg:w-4/5'>
            <Input
              value={name}
              onChange={setName}
              placeholder='Nama Pekerjaan'
              required
              disabled={isFormSubmitting}
            />
            <CreatableSelect
              value={preferences.map(preference => ({ value: preference.id, label: preference.label }))}
              onChange={arrOfObj => setPreferences(arrOfObj.map(obj => ({ id: obj.value, label: obj.label, isNew: obj.__isNew__ })))}
              isMulti
              options={allPreferences.map(preference => ({ value: preference.id, label: preference.label }))}
              placeholder='Preferensi'
              formatCreateLabel={inputValue => `Tambah '${inputValue}'`}
              isDisabled={isFormSubmitting}
              required
            />
            <Input
              value={address}
              onChange={setAddress}
              placeholder='Alamat'
              required
              disabled={isFormSubmitting}
            />
            <div className='w-full flex flex-col xl:flex-row gap-2 sm:gap-4'>
              <div className='flex-1'>
                <Input
                  value={salary}
                  onChange={setSalary}
                  placeholder='Gaji'
                  type='number'
                  required
                  disabled={isFormSubmitting}
                />
              </div>
              <div className='flex-1 flex items-center gap-1'>
                <div className='flex-1'>
                  <Input
                    value={startWorkingHour}
                    onChange={setStartWorkingHour}
                    placeholder='Awal Jam Kerja (Jam)'
                    type='number'
                    required
                    disabled={isFormSubmitting}
                  />
                </div>
                <div>:</div>
                <div className='flex-1'>
                  <Input
                    value={startWorkingMinute}
                    onChange={setStartWorkingMinute}
                    placeholder='Awal Jam Kerja (Menit)'
                    type='number'
                    required
                    disabled={isFormSubmitting}
                  />
                </div>
              </div>
              <div className='flex-1 flex items-center gap-1'>
                <div className='flex-1'>
                  <Input
                    value={endWorkingHour}
                    onChange={setEndWorkingHour}
                    placeholder='Akhir Jam Kerja (Jam)'
                    type='number'
                    required
                    disabled={isFormSubmitting}
                  />
                </div>
                <div>:</div>
                <div className='flex-1'>
                  <Input
                    value={endWorkingMinute}
                    onChange={setEndWorkingMinute}
                    placeholder='Akhir Jam Kerja (Menit)'
                    type='number'
                    required
                    disabled={isFormSubmitting}
                  />
                </div>
              </div>
            </div>
            <Input
              value={requirements}
              onChange={setRequirements}
              placeholder='Syarat'
              required
              disabled={isFormSubmitting}
            />

            <div className='mt-4 sm:mt-8 flex gap-2 sm:gap-4'>
              <Button
                theme='secondary'
                type='button'
                disabled={isFormSubmitting}
              >
                Batal
              </Button>
              <Button type='submit' disabled={isFormSubmitting}>Tambah</Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};



export { PostJob };

