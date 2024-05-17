import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logo } from '../../assets/img';
import { BASE_URL } from '../../constants';

import { PasswordInputsForm } from './PasswordInputs';
import { Success } from './Success';
import { UsernameInputForm } from './UsernameInputForm';
import { SecurityQuestionForm } from './SecurityQuestionForm';



/**
 * Komponen untuk mengatur proses lupa password.
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('jobSeeker');
  const [id, setId] = useState(null);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityQuestionCorrectAnswer, setSecurityQuestionCorrectAnswer] = useState('');
  const [securityQuestionUserAnswer, setSecurityQuestionUserAnswer] = useState('');
  const [isSecurityQuestionAnswerCorrect, setIsSecurityQuestionAnswerCorrect] = useState(false);
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
      getSecurityQuestion(res.data.data);
    } catch (err) {
      console.error('Unable to get username: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  async function getSecurityQuestion(id) {
    try {
      setIsFormSubmitting(true);

      if (!username) return;
      
      const res = await axios.get(`${BASE_URL}/user/${id}`);

      if (!res.data?.status) throw new Error();

      setSecurityQuestion(res.data.data.pemulihanKataSandi.pertanyaan);
      setSecurityQuestionCorrectAnswer(res.data.data.pemulihanKataSandi.jawaban);
    } catch (err) {
      console.error('Unable to get username: ', err);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  async function handleSecurityQuestionFormOnSubmit(e) {
    e.preventDefault();

    if (securityQuestionCorrectAnswer !== securityQuestionUserAnswer) return;
    
    setIsSecurityQuestionAnswerCorrect(true);
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
      <img src={logo} alt='logo' className='h-32' />

      <div className='mt-8 w-full max-w-96'>
        {!id && (
          <UsernameInputForm
            handleFormOnSubmit={handleUsernameFormOnSubmit}
            username={username} setUsername={setUsername}
            role={role} setRole={setRole}
            isFormSubmitting={isFormSubmitting}
          />
        )}

        {(id && securityQuestion && !isSecurityQuestionAnswerCorrect) && (
          <SecurityQuestionForm
            handleFormOnSubmit={handleSecurityQuestionFormOnSubmit}
            securityQuestion={securityQuestion}
            securityQuestionUserAnswer={securityQuestionUserAnswer} setSecurityQuestionUserAnswer={setSecurityQuestionUserAnswer}
            isFormSubmitting={isFormSubmitting}
          />
        )}

        {(isSecurityQuestionAnswerCorrect && !isPasswordChanged) && (
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

