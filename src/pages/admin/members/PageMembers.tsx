import { useEffect, useState } from 'react';
import { LayoutDashboard } from '../../../shared/layouts';
import { IUserData, UsersService } from '../../../shared/api/users/UserServices';
import { getRoleClass } from '../../../shared/hook/getRoleClass';
import { DropdownMenu } from '../../../shared/components/ui/dropdown-menu/DropdownMenu';
import { useSearchParams } from 'react-router-dom';
import { roles, TUsersRole } from '../../../shared/services/userOptions';
import { DashboardCardInfo } from '../../../shared/components/user-card-information/dashboard-card-info';

export const PageMembers = () => {
  const [members, setMembers] = useState<IUserData[]>([]);
  const [memberId, setMemberId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const toggleDialog = () => setIsOpen((prev) => !prev);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [totalMembros, setTotalMembros] = useState(0);
  const [totalAssinantes, setTotalAssinantes] = useState(0);
  const [totalExAssinantes, setTotalExAssinantes] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchMembers = async () => {
      UsersService.getAll({ 
        page: Number(searchParams.get('page')) || 1,
        order: searchParams.get('order') as 'asc' | 'desc',
        role: searchParams.get('role') as TUsersRole,
      }).then((response) => {
        if (response instanceof Error) {
          console.error(response);
          return;
        }
        setMembers(response.users);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
  
        setTotalAssinantes(response.totalAssinantes);
        setTotalMembros(response.totalMembros);
        setTotalExAssinantes(response.totalExAssinantes);

        setLoading(false);
      });
    };

    fetchMembers();
  }, [searchParams, isOpen]);

  const orderOptions = [
    { name: 'Mais recentes', key: 'desc' },
    { name: 'Mais antigos', key: 'asc' },
  ];

  const rolesOptions = Object.entries(roles)
  .filter(([key]) => ['membro', 'assinante', 'noAssinante'].includes(key))
  .map(([key, value]) => ({
    name: value.name,
    key: key as TUsersRole,
  }));

  const handleRoleChange = (key: string) => {
    updateRoleChange(key as TUsersRole);
  };
  
  function handleOrderChange(key: string): void {
    updateOrderParam(key as 'asc' | 'desc');
  }

  const updateOrderParam = (order: 'asc' | 'desc') => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('order', order);
    setSearchParams(newSearchParams);
  };

  const updatePageParam = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  const updateRoleChange = (role: TUsersRole) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.get('role') === role) {
      newSearchParams.delete('role');
    } else {
      newSearchParams.set('role', role);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <LayoutDashboard>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <button className="bg-bgBtn text-white font-medium px-4 py-2 opacity-50 cursor-not-allowed">EXPORTAR</button>
          {/* Filtros */}
                <div className="flex gap-2 my-4">
                  <DropdownMenu textButton="Membresia" items={rolesOptions} onSelect={handleRoleChange} />
                  <DropdownMenu textButton="Ordenação" items={orderOptions} onSelect={handleOrderChange} />
                </div>
        </div>
        {/* Tabela */}
        <div className="flex gap-2">
          <table>
            <thead>
              <tr>
                <td></td>
                <td className="text-medium">inscritos</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-2">membros</td>
                <td className="bg-white text-center">{totalMembros}</td>
              </tr>
              <tr>
                <td className="pr-2">assinantes</td>
                <td className="bg-white text-center">{totalAssinantes}</td>
              </tr>
              <tr>
                <td className="pr-2">ex assinantes</td>
                <td className="bg-white text-center">{totalExAssinantes}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      { loading ? (
        <div className="flex justify-center items-center">
          <div className="loader">Carregando...</div>
        </div>
      ) : (
        <div className="bg-white mt-4 border border-gray-300 font-montserrat font-medium overflow-y-auto">
        <ul>
          {members.map((member) => (
            <li
              key={member.id}
              className="border-b border-gray-300 p-4 last:border-0 flex justify-between items-center"
              onClick={() => {
                toggleDialog();
                setMemberId(member.id);
              }}
            >
              <p className="highlight-link font-semibold">{member.email}</p>
              <p className={`rounded-full px-4 py-1 ${getRoleClass(member.role)}`}>{member.role}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center border-t border-gray-300 p-4">
          <button
            onClick={() => updatePageParam(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-4 py-2 text-sm ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-bgBtn text-white'}`}
          >
            Anterior
          </button>
          <p className="text-sm">
            Página {currentPage} de {totalPages}
          </p>
          <button
            onClick={() => updatePageParam(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 text-sm ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-bgBtn text-white'}`}
          >
            Próximo
          </button>
        </div>
        <DashboardCardInfo isOpen={isOpen} toggleDialog={toggleDialog} id={memberId} />
      </div>
      ) }

    </LayoutDashboard>
  );
};
