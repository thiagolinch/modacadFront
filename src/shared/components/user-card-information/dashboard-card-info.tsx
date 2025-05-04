import { FC, useEffect, useState } from 'react';
import { TMemberProfile, UsersService } from '../../../shared/api/users/UserServices';

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


  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-3xl p-5">
        <div className='border border-slate-900 p-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-montserrat font">Perfil do Usuario</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={toggleDialog}>
              ✕
            </button>
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
                <p className="text-gray-700 font-montserrat">Nome: <span className=''>{user?.name}</span></p>
                <p className="text-gray-700 font-montserrat">Email: <span className=''>{user?.email}</span></p>
                <p className="text-gray-700 font-montserrat">Membresia: <span className=''>{user?.role}</span></p>
              </div>

              {/* Coluna 2 - Datas */}
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 font-montserrat">
                  Assinou em: <span className=''>{user?.subscription_created_at ? new Date(user.subscription_created_at).toLocaleDateString() : '-'}</span>
                </p>
                <p className="text-gray-700 font-montserrat">
                  Primeiro pagamento: <span className=''>{user?.payment_created_at ? new Date(user.payment_created_at).toLocaleDateString() : '-'}</span>
                </p>
                <p className="text-gray-700 font-montserrat">
                  Último pagamento: <span className=''>{user?.payment_updated_at ? new Date(user.payment_updated_at).toLocaleDateString() : '-'}</span>
                </p>
              </div>
            </div>

          )}
          </div>
        </div>
        
      </div>
    </div>
  ) : null;
};
