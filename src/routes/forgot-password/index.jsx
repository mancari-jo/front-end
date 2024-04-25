import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logo } from '../../assets/img';
import { BASE_URL } from '../../constants';

import { PasswordInputsForm } from './PasswordInputs';
import { Success } from './Success';
import { UsernameInputForm } from './UsernameInputForm';



/**
 * Komponen untuk mengatur proses lupa password.
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('jobSeeker');
  const [id, setId] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  /**
   * Handler untuk mengirim permintaan untuk memeriksa username.
   * @param {Object} e - Objek event.
   */
  async function handleUsernameFormOnSubmit(e) {
    e.preventDefault();

    try {
      setIsFormSubmitting(true);

      if (!username) return;
      
      const res = await axios.get(`${BASE_URL}/auth/check-username?namaPengguna=${username}&role=${role}`);

      if (!res.data?.status) throw new Error();

      setId(res.data.data);
    } catch (err) {
      console.error('Unable to get username: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  /**
   * Handler untuk mengirim permintaan untuk mengubah password.
   * @param {Object} e - Objek event.
   */
  async function handlePasswordsFormOnSubmit(e) {
    e.preventDefault();

    try {
      setIsFormSubmitting(true);

      if (!password || !confirmPassword || (password !== confirmPassword)) return;

      const payload = {
        id,
        password,
        role
      };
      
      const res = await axios.patch(`${BASE_URL}/auth/change-password`, payload);
    
      if (!res.data?.status) throw new Error();

      setIsPasswordChanged(true);
    } catch (err) {
      console.error('Unable to get username: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }



  return (
    <main className='bg-1 justify-center items-center p-4'>
      <img src={logo} alt='logo' className='h-64' />

      <div className='mt-16 w-full max-w-96'>
        {!id && (
          <UsernameInputForm
            handleFormOnSubmit={handleUsernameFormOnSubmit}
            username={username} setUsername={setUsername}
            role={role} setRole={setRole}
            isFormSubmitting={isFormSubmitting}
          />
        )}

        {(id && !isPasswordChanged) && (
          <PasswordInputsForm
            handleFormOnSubmit={handlePasswordsFormOnSubmit}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            isFormSubmitting={isFormSubmitting}
          />
        )}
        
        {isPasswordChanged && <Success navigate={navigate} />}
      </div>
    </main>
  );
};



export { ForgotPassword };

