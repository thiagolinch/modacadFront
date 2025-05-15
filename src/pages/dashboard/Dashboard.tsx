import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { LayoutDashboard } from '../../shared/layouts/LayoutDashboard';
import { IPostData, PostsService } from '../../shared/api/posts/PostsService';
import { statuses, TPostsStatus, TPostsType, TPostsVisibility, visibilities } from '../../shared/services/postOptions';
import { DropdownMenu } from '../../shared/components/ui/dropdown-menu/DropdownMenu';
import { Link } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { SearchPosts } from './component/searchPosts';

export const Dashboard: React.FC = () => {

  const { type } = useParams<{ type: TPostsType }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<IPostData[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await PostsService.getAll({
        type: type || 'texto',
        status: searchParams.get('status') as TPostsStatus || 'published',
        subject: searchParams.get('subject') || '',
        visibility: searchParams.get('visibility') as TPostsVisibility,
        order: searchParams.get('order') as 'asc' | 'desc',
        page: Number(searchParams.get('page')) || 1,
      });
      if (data instanceof Error) {
        console.error(data.message);
      } else {
        setRows(data.posts);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    };

    fetchData();
  }, [type, searchParams]);

  const statusesOptions = Object.entries(statuses).map(([key, value]) => ({
    name: value.name,
    key: key as TPostsStatus,
  }));

  const visibilitiesOptions = Object.entries(visibilities).map(([key, value]) => ({
    name: value.name,
    key: key as TPostsVisibility,
  }));

  const orderOptions = [
    { name: 'Mais recentes', key: 'desc' },
    { name: 'Mais antigas', key: 'asc' },
  ];

  const handleStatusChange = (key: string) => {
    updateStatusParam(key as TPostsStatus);
  };

  const handleVisibilityChange = (key: string) => {
    updateVisibilityParam(key as TPostsVisibility);
  };

  const handleOrderChange = (key: string) => {
    updateOrderParam(key as 'asc' | 'desc');
  };

  const updateStatusParam = (status: TPostsStatus) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.get('status') === status) {
      newSearchParams.delete('status');
    } else {
      newSearchParams.set('status', status);
    }
    setSearchParams(newSearchParams);
  };

  const updateVisibilityParam = (visibility: TPostsVisibility) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.get('visibility') === visibility) {
      newSearchParams.delete('visibility');
    } else {
      newSearchParams.set('visibility', visibility);
    }
    setSearchParams(newSearchParams);
  };

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

  const handleClearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('status');
    newSearchParams.delete('visibility');
    newSearchParams.delete('order');
    setSearchParams(newSearchParams);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  return (
    <LayoutDashboard>
      {/* Filtros */}
      <div className="flex gap-2 my-4">
        <DropdownMenu textButton="Status" items={statusesOptions} onSelect={handleStatusChange} />
        <DropdownMenu textButton="Ordenação" items={orderOptions} onSelect={handleOrderChange} />
        <DropdownMenu textButton="Visibilidade" items={visibilitiesOptions} onSelect={handleVisibilityChange} />

        <div className="flex-1 max-w-md">
        <SearchPosts />
      </div>
      </div>
      {/* Título */}
      <div className="my-4 border border-gray-200 p-4 bg-white flex gap-4">
        <Link to={'/posts/novo'} className="bg-bgBtn py-4 px-2 text-1xl text-white flex gap-2 items-center">
          NOVO
          <FaPlusCircle />
        </Link>
        <button
          className="border border-bgBtn px-2 py-4 text-bgBtn hover:bg-bgBtn hover:text-white"
          onClick={handleClearFilters}
        >
          Limpar filtros
        </button>
      </div>
      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader">Carregando...</div>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200">
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-4 w-full border-b font-semibold highlight-link">
                    <Link to={`/posts/${row.id}/editar`}>{row.title}</Link>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${statuses[row.status] ? `${statuses[row.status].bgColor} ${statuses[row.status].textColor}` : ''}`}
                    >
                      {statuses[row.status] ? statuses[row.status].name : row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${visibilities[row.visibility] ? `${visibilities[row.visibility].bgColor} ${visibilities[row.visibility].textColor}` : ''}`}
                    >
                      {visibilities[row.visibility] ? visibilities[row.visibility].name : row.visibility}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span>
                      {row.clicks_count ? row.clicks_count : "-"} views
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => updatePageParam(currentPage - 1)}
              disabled={currentPage <= 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => updatePageParam(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </LayoutDashboard>
  );
};
