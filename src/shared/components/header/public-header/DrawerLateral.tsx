import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthDialog } from '../../../../shared/contexts/AuthDialogContext';
import { useUser } from '../../../../shared/contexts';
import { CiLogout } from 'react-icons/ci';
import { FaUserCircle } from 'react-icons/fa';
import { UserProfileCard } from '../../user-card-information/userProfileCard';

interface IDrawerLateralProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const menuItems = [
  { label: 'Textos Publicados', link: '/posts' },
  { label: 'Textos Mais Lidos', link: '/posts/popular' },
  { label: 'Pílulas', link: '/pilulas' },
  { label: 'Planos', link: '/planos' },
  // { label: 'Moldes Modacad', link: '#' },
  // { label: 'Contatos', link: '#' },
];

export const DrawerLateral: FC<IDrawerLateralProps> = ({ isOpen, toggleDrawer }) => {
  const { user, logout } = useUser();
  
  const [isCardOpen, setIsCardOpen] = useState(false);
  const toggleProfile = () => setIsCardOpen((prev) => !prev);

  const { openDialog } = useAuthDialog();

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white w-full md:w-[600px] transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-50`}
    >
      <div className="flex justify-end px-4 pt-4">
        <button className="p-2 border border-gray-950" onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul className="p-4 font-butler text-2xl">
        {menuItems.map((item, index) => (
          <li className="mb-2" key={index}>
            <Link to={item.link} className="block p-2 highlight-link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-4 font-montserrat">
        {user ? (
          <div className="border border-gray-950 p-4 font-montserrat font-light text-gray-950">
            <div className='flex items-center justify-between gap-2 mt-2 px-5'>
              <div className='flex items-center gap-2'>
                <FaUserCircle size={45}/>
                <div>
                  Olá, <span className='text-yellow-600'>{user.name}</span>
                  <button
                  onClick={toggleProfile}
                   className='lg:hidden text-sm font-montserrat font-light'
                  >
                    Meu perfil
                  </button>
                </div>
              </div>

              <button className="flex gap-2 mr-10" onClick={logout}>
                Sair <CiLogout size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-950 p-4">
            <p className="text-gray-950 font-light">Faça login para aproveitar ao máximo nosso site.</p>
            <button className="bg-primary px-4 py-2 border border-gray-950 mt-2" onClick={() => openDialog('login')}>
              ENTRAR
            </button>
          </div>
        )}
      </div>
      {
        user && isCardOpen ? <UserProfileCard isOpen={isCardOpen} toggleDialog={toggleProfile} /> : null
      }
    </div>
  );
};
