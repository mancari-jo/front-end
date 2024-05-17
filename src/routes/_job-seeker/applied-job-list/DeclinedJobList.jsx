import { Button } from '../../../components/button';
import convertToProperSalaryString from '../../../utils/convertToProperSalaryString';



const DeclinedJobList = ({ preferenceList, jobList, handleJobOnClick }) => {
  return (
    <>
      <h1 className='text-sm font-bold text-center'>Daftar Pekerjaan yang Ditolak</h1>

      <div className='flex-1 w-full'>
        {!jobList ? (
          <h2 className='text-xs bg-background px-1 py-2 rounded text-center'>Sedang memuat data ...</h2>
        ) : (jobList.length === 0) ? (
          <h2 className='text-xs bg-background px-1 py-2 rounded text-center'>Kosong</h2>
        ) : (jobList.length > 0) && (
          <div className='flex flex-col gap-4 overflow-auto'>
            {jobList.map((job, index) => (
              <div key={index} className='bg-background py-2 px-4 rounded flex flex-col items-center'>
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
    </>
  );
};



export { DeclinedJobList };
