import { useParams } from 'react-router-dom';

import { Header } from '../../components/header';



/**
 * Komponen untuk menampilkan daftar pekerjaan yang tersedia.
 */
const Message = () => {
  const { Nav, BurgerMenu } = Header();

  const { message } = useParams();





  return (
    <main className='bg-2 overflow-auto'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='text-xs flex-1 flex justify-center items-center overflow-auto px-4 md:px-16 xl:px-32'>
          <div className='bg-background p-2 rounded-lg'>
            {message}
          </div>
        </div>
      </div>
    </main>
  );
};



export { Message };

