import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { UsersService } from '../../../shared/api/users/UserServices';

interface ICardInfoProps {
    isOpen: boolean;
    toggleDialog: () => void;
}

interface IFormMember {
  email: string;
  name: string;
  cellphone: string;
  plans: string;
}

const initialFormValues: IFormMember = {
    email: '',
    name: '',
    cellphone: '',
    plans: '',
};

const formMemberSchema: yup.ObjectSchema<IFormMember> = yup.object().shape({
  email: yup.string().email('Informe um e-mail válido').required('E-mail é obrigatório'),
  name: yup.string().required('Nome é obrigatório'),
  cellphone: yup.string().nullable().default(null),
}) as yup.ObjectSchema<IFormMember>;

export const UserProfileCard: FC<ICardInfoProps> = ({ isOpen, toggleDialog }) => {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
} = useForm<IFormMember>({
    resolver: yupResolver(formMemberSchema),
    defaultValues: initialFormValues,
    mode: 'onBlur',
});


  const onSubmit: SubmitHandler<IFormMember> = async (data) => {
      setLoading(true);
  
      try {
        // Atualizar dados básicos
        const profileResponse = await UsersService.updateProfile({
            email: data.email,
            name: data.name,
            cellphone: data.cellphone,
        });
        if (profileResponse instanceof Error) throw profileResponse;
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const response = await UsersService.getProfile();
          if (response instanceof Error) {
            console.error(response);
            return;
          }
  
          reset({
            email: response.email || '',
            name: response.name || '',
            cellphone: response.cellphone || '',
          });
          //setProfile(response)
        } finally {
          setLoading(false);
        }
      };
  
      loadProfile();
    }, []);


  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-3xl p-5">
        <div className='grid border border-slate-900 justify-center items-center'>
          <div className="flex justify-between items-center pt-10 pb-4">
            <h2 className=" text-3xl lg:text-6xl font-butler font-extralight">Ola, {watch('name')}</h2>
          </div>
          
          <div className="mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="loader">Carregando...</div>
            </div>
          ) : (
            <div className="grid grid-cols items-center justify-center gap-4 w-full">
                <form onSubmit={handleSubmit(onSubmit)} className=' w-full'>
                    <div className="mt-2">
                        <input
                            {...register('name')}
                            type="text"
                            id="name-create"
                            className="border-b border-black text-gray-900 text-sm block w-full p-2.5 focus:outline-none"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mt-2 ">
                        <input
                            {...register('email')}
                            type="text"
                            id="email-create"
                            className="border-b border-black  text-gray-900 text-sm  block w-full p-2.5 focus:outline-none"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mt-2 ">
                        <input
                            {...register('cellphone')}
                            type="text"
                            id="cellphone-create"
                            className="border-b border-black  text-gray-900 text-sm  block w-full p-2.5 focus:outline-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="mt-10 flex gap-3">
                        <button className="px-8 py-4 text-gray-950 border border-gray-950 hover:bg-primary">Salvar</button>
                        <button
                            onClick={toggleDialog}
                            className="px-8 py-4 bg-yellow-300 text-white border border-black"
                        >
                            Fechar
                        </button>
                    </div>
                </form>
            </div>
          )}
          </div>
          
        </div>
        
      </div>
    </div>
  ) : null;
};
