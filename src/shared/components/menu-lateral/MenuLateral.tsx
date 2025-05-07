import { Link } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

import logo from '../../../assets/svg/icon_rounded_bg_red.svg';
import { useUser } from '../../../shared/contexts';
import { TRoleStaff } from 'src/routes/ProtectedRoute';

const rolePermissions: Record<TRoleStaff, string[]> = {
  autor: ['posts', 'pílulas', 'institucional', 'ver site', 'meu perfil'],
  curador: [],
  editor: [],
  administrador: ['tags', 'assuntos', 'membros', 'planos', 'equipe'],
};

const getAccumulatedPermissions = (role: TRoleStaff): string[] => {
  const rolesOrder: TRoleStaff[] = ['autor', 'curador', 'editor', 'administrador'];
  const roleIndex = rolesOrder.indexOf(role);

  return rolesOrder.slice(0, roleIndex + 1).flatMap((r) => rolePermissions[r]);
};

interface ILink {
  name: string;
  path: string;
  disabled?: boolean;
}

const primaryLinks: ILink[] = [
  { name: 'posts', path: '/dashboard/texto' },
  { name: 'pílulas', path: '/dashboard/pilula' },
  { name: 'institucional', path: '/dashboard/texto?subject=1c83eada-dac0-463b-92e1-40e01b0d8738' },
  { name: 'tags', path: '/admin/tags' },
  { name: 'assuntos', path: '/admin/assuntos' },
];

const secondaryLinks: ILink[] = [
  { name: 'meu perfil', path: '/admin/meu-perfil' },
  { name: 'membros', path: '/admin/membros' },
  { name: 'planos', path: '/admin/planos' },
  { name: 'equipe', path: '/admin/equipe' },
  { name: 'ver site', path: '/' },
];

export const MenuLateral = () => {
  const { user, logout } = useUser();

  const handleClickGA = () => {

    window.gtag && window.gtag('event', 'go_to_plans_side_menu', {
      method: 'cta_card' // ou email, google, etc, como preferir
    });
  }

  const role = user?.role as TRoleStaff;

  const accumulatedPermissions = getAccumulatedPermissions(role);

  const isLinkAllowed = (linkName: string) => {
    return accumulatedPermissions.includes(linkName);
  };

  const mappedPrimaryLinks = primaryLinks.map((link) => ({
    ...link,
    disabled: !isLinkAllowed(link.name),
  }));

  const mappedSecondaryLinks = secondaryLinks.map((link) => ({
    ...link,
    disabled: !isLinkAllowed(link.name),
  }));

  return (
    <div className="h-full w-full flex flex-col border-r border-gray-950 font-montserrat text-2xl p-4 justify-between">
      {/* Logo */}
      <div className="grid justify-center mt-10 items-center gap-4">
          <p className="font-montserrat font-normal text-2xl">Olá, {user?.name} </p>
          <button onClick={logout} className="flex items-center font-montserrat font-light text-lg gap-2">
            <CiLogout size={24} /> sair?
          </button>
      </div>

      {/* Primary Links */}
      <nav>
        {mappedPrimaryLinks.map((link) => (
          <Link
            key={link.name}
            to={link.disabled ? '#' : link.path}
            className={`flex items-center mt-4 ${link.disabled ? 'opacity-30 cursor-not-allowed' : 'highlight-link'}`}
            onClick={(e) => link.disabled && e.preventDefault()}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Secondary Links */}
      <nav>
        {mappedSecondaryLinks.map((link) => (
          <Link
            key={link.name}
            to={link.disabled ? '#' : link.path}
            className={`flex items-center mt-4 ${link.disabled ? 'opacity-30 cursor-not-allowed' : 'highlight-link'}`}
            onClick={(e) => {
              if (link.disabled) {
                e.preventDefault();
              } else if (link.path === '/planos') {
                handleClickGA();
              }
            }}
          
          >
            {link.name}
          </Link>
        ))}
      </nav>
      {/* Footer */}
      <div className="flex justify-center">
        <img src={logo} alt="Logo" className="w-16" />
      </div>
    </div>
  );
};
