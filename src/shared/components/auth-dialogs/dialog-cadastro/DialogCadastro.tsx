import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AuthService, ICadastroForm } from '../../../../shared/api/auth/AuthService';
import { useAuthDialog } from '../../../contexts/AuthDialogContext';
import { useUser } from '../../../../shared/contexts';

const cadastroSchema: yup.ObjectSchema<ICadastroForm> = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const initialFormValues: ICadastroForm = {
  name: '',
  email: '',
  password: '',
};

export const DialogCadastro = () => {
  const { isOpen, closeDialog, openDialog } = useAuthDialog();
  const { login } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICadastroForm>({
    resolver: yupResolver(cadastroSchema),
  });

  const onSubmit: SubmitHandler<ICadastroForm> = async (data) => {
    try {
      const cadastroResponse = await AuthService.cadastro(data);

      if (cadastroResponse instanceof Error) {
        console.error(cadastroResponse);
        return;
      }

      const loginResponse = await AuthService.login(data.email, data.password);

      if (loginResponse instanceof Error) {
        console.error(loginResponse);
        return;
      }

      window.gtag && window.gtag('event', 'sign_up', {
        method: 'popup_form' // ou email, google, etc, como preferir
      });

      login(loginResponse.token, loginResponse.admin);
      reset(initialFormValues);
      closeDialog();
    } catch (error) {
      console.error('Erro inesperado', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeDialog}>
      <div
        className="bg-[#f1ece8] p-8 w-[80%] max-w-[500px] justify-self-center items-center shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-slate-900 flex flex-col justify-center items-center p-4">
          <h2 className="font-butler text-4xl w-full text-center mb-4">Cadastro</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="px-4 w-full space-y-4 font-montserrat">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                {...register('name')}
                type="text"
                className="w-full bg-transparent border-b border-slate-900 shadow-sm placeholder-[#202020] text-center focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-transparent border-b border-slate-900 shadow-sm placeholder-[#202020] text-center focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Senha</label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-transparent border-b border-slate-900 shadow-sm placeholder-[#202020] text-center focus:outline-none"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Entrar
            </button>
          </form>
          <div className="mt-4 font-montserrat w-full">
            <p className="text-sm text-gray-500 text-center">Já tem uma conta?</p>
            <div className="flex items-center justify-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 text-center"
                onClick={() => openDialog('login')}
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
