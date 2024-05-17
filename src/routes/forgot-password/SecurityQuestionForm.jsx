import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Select } from '../../components/select';



const SecurityQuestionForm = ({
  handleFormOnSubmit,
  securityQuestion,
  securityQuestionUserAnswer, setSecurityQuestionUserAnswer,
  isFormSubmitting
}) => {
  return (
    <form onSubmit={handleFormOnSubmit} className='flex flex-col gap-4'>
      <div className='text-xs font-bold'>
        {securityQuestion}
      </div>

      <Input
        placeholder='Jawaban anda'
        value={securityQuestionUserAnswer}
        onChange={setSecurityQuestionUserAnswer}
        required
        disabled={isFormSubmitting}
      />

      <Button type='submit' disabled={isFormSubmitting}>
        Jawab
      </Button>
    </form>
  );
};



export { SecurityQuestionForm };

