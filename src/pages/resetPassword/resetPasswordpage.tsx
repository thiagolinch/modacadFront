import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '../../shared/services/axios';
import { useUser } from '../../shared/contexts/UserContext';

export function ResetPassword() {
  const { token } = useParams(); 
  const { logout } = useUser();

  // SETTING API
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  let history = useNavigate();

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      await api.post(`/password/reset?token=${token}`, {
        password: newPassword,
      });

      logout();
      history('/');
    } catch (error) {
      console.error("Erro ao resetar a senha:", error);
      setErrorMessage('Erro ao resetar a senha. Tente novamente.');
    }

  }

  return (
    <div className="w-[100%] h-screen justify-center fixed flex  backdrop-blur-sm">
      <div className="bg-[#f1ece8] p-[10px] h-[385px] w-[80%] min-w-[320px] max-w-[500px] justify-self-center items-center mt-[8%]">
        <div className="border-[1px] border-[#202020] flex flex-col justify-center items-center p-[20px]">
          <div
            className="font-butler_ultra_light text-[35px] w-full min-h-[30px] flex justify-center items-center mb-[20px]
                        bg-gradient-to-t from-[#dcdf1e] to-[#dcdf1e] bg-[length:95%_.50em] bg-no-repeat  bg-[position:50%_75%]
                    "
          >
            Redefinição de Senha
          </div>
          <div className="flex flex-col justify-center items-center">
          <form action="" method="post" className="mb-[20px] px-3 min-w-[100%] md:min-w-[50%] md:max-w-[100%]">
              <input
                type={showPassword ? 'text' : 'password'}
                onChange={(event) => {setNewPassword(event.target.value), setErrorMessage('')}}
                placeholder="Digite sua nova senha"
                className="w-full h-12 mb-[10px] bg-transparent
                                text-[16px] font-montserratLight
                                border-b-[1px] border-slate-900 shadow-sm placeholder-[#202020] text-center
                                focus:outline-none
                                disabled:bg-slate-50 disabled:text-[#202020] disabled:border-slate-200 disabled:shadow-none
                            "
              />
              <input
                type={showPassword ? 'text' : 'password'}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirme sua nova senha"
                className="w-full h-12 mb-[20px] bg-transparent
                                text-[16px] font-montserratLight
                                border-b-[1px] border-slate-900 shadow-sm placeholder-[#202020] text-center
                                focus:outline-none
                                disabled:bg-slate-50 disabled:text-[#202020] disabled:border-slate-200 disabled:shadow-none
                            "
              />
              <div className="flex items-center mb-[20px]">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-10 font-montserrat w-full h-8 items-center flex">
                  Mostrar senhas
                </label>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-[14px] mb-[10px]">
                  {errorMessage}
                </div>
              )}
            </form>

            <button
              className="min-h-[60px] w-auto min-w-[210px] p-2 px-[25px]
                                border-[1px] border-[#202020]
                                font-montserrat_medium text-[22px]
                                flex flex-col justify-center items-center
                                bg-gradient-to-t from-[#dcdf1e] to-[#dcdf1e] bg-[length:90%_.90em] bg-no-repeat bg-[position:calc(90%_-_var(--p,0%))_900%]  hover:bg-[position:50%_75%]"
              onClick={handleResetPassword}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
