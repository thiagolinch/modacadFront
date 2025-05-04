import { FC, useEffect, useState } from 'react';
import { TMemberProfile, UsersService } from '../../../shared/api/users/UserServices';
import { FaRegTrashAlt } from 'react-icons/fa';

interface ICardInfoProps {
    id: string;
    isOpen: boolean;
    toggleDialog: () => void;
}

export const DashboardCardInfo: FC<ICardInfoProps> = ({ id, isOpen, toggleDialog }) => {
  const [user, setUser] = useState<TMemberProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleGet();
    }
  }, [isOpen, id]);



  const handleGet = async () => {
    setLoading(true);
    
    const response = await UsersService.getMemberProfile(id)

    if (response instanceof Error) {
      console.error(response.message);
      setLoading(false);
      return;
    }

    setUser(response);
    setLoading(false);
  };

  const handleDeleteuser = async (id: string) => {
    setLoading(true);
    
    try {
      await UsersService.deleteById(id)

      toggleDialog();
      setLoading(false);
    } catch (error) {
      console.error("Erro ao deletar usuario", error);
      setLoading(false);
      return;
    }
    
  }


  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-3xl p-5">
        <div className='border border-slate-900 p-5'>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-montserrat font-light">Informações do usuário</h2>
          </div>
          
          <div className="mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="loader">Carregando...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Coluna 1 - Informações básicas */}
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 font-montserrat font-light">Nome: <span className=''>{user?.name}</span></p>
                <p className="text-gray-700 font-montserrat font-light">Email: <span className=''>{user?.email}</span></p>
                <p className="text-gray-700 font-montserrat font-light">Membresia: <span className=''>{user?.role}</span></p>
              </div>

              {/* Coluna 2 - Datas */}
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 font-montserrat font-light">
                  Assinou em: <span className=''>{user?.subscription_created_at ? new Date(user.subscription_created_at).toLocaleDateString() : '-'}</span>
                </p>
                <p className="text-gray-700 font-montserrat font-light">
                  Primeiro pagamento: <span className=''>{user?.payment_created_at ? new Date(user.payment_created_at).toLocaleDateString() : '-'}</span>
                </p>
                <p className="text-gray-700 font-montserrat font-light">
                  Último pagamento: <span className=''>{user?.payment_updated_at ? new Date(user.payment_updated_at).toLocaleDateString() : '-'}</span>
                </p>
              </div>
            </div>
          )}

          {user ?  (
            <div className='mt-10 flex gap-4 justify-end'>
              <button
                className="px-6 py-2  bg-red-800 text-white w-auto border border-black"
                onClick={() => handleDeleteuser(id)}
              >
                <FaRegTrashAlt size={24} />
              </button>
              <button
                className="px-6 py-2  bg-yellow-300 text-white w-auto h-auto border border-black"
                onClick={() => toggleDialog()}
              >
                Fechar
              </button>
            
            </div>
          ) : null}
          </div>
        </div>
        
      </div>
    </div>
  ) : null;
};
