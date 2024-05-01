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
        <div className='flex-1 flex justify-center items-center overflow-auto px-8 md:px-32 xl:px-64'>
          <div className='bg-background p-4 rounded-lg'>
            {message}
          </div>
        </div>
      </div>
    </main>
  );
};



export { Message };

