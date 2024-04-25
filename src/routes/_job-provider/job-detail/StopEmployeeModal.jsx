import { useState } from 'react';

import { starBlue, starWhite } from '../../../assets/svg';
import { Button } from '../../../components/button';



/**
 * Komponen modal untuk menghentikan pegawai.
 * 
 * @param {function} stopEmployee Fungsi yang dipanggil saat pengguna mengkonfirmasi untuk menghentikan pegawai.
 * @returns {JSX.Element} Komponen React untuk modal penghentian pegawai.
 */
const StopEmployeeModal = ({stopEmployee }) => {
  const [selectedRating, setSelectedRating] = useState(0);



  return (
    <div className='h-screen w-screen absolute top-0 bg-background bg-opacity-75 flex items-center justify-center p-8'>
      <div className='bg-background border border-black p-8 rounded-lg flex flex-col gap-8'>
        <h1 className='text-xl text-center'>Untuk menghentikan pegawai ini, berikan rating terlebih dahulu</h1>
        
        <div className='flex gap-2 justify-center'>
          {[...new Array(5)].map((_, index) => (
            <button key={index} onClick={() => setSelectedRating(index+1)}>
              <img key={index} src={(selectedRating < index+1) ? starWhite : starBlue} alt='star' className='h-10 w-10 transition-all' />
            </button>
          ))}
        </div>

        <div className='flex flex-col gap-4'>
          <Button theme='secondary' onClick={() => stopEmployee(0)}>Batal Hentikan Pegawai</Button>
          <Button theme='danger' onClick={() => stopEmployee(selectedRating)} disabled={!selectedRating}>Hentikan Pegawai</Button>
        </div>
      </div>
    </div>
  );
};



export { StopEmployeeModal };

