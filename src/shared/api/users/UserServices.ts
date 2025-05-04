import { api } from '../../../shared/services/axios';
import { EUsersStatus, TUsersPlan, TUsersRole } from 'src/shared/services/userOptions';

export interface IUserData {
  avatar: string | null;
  cellphone: string;
  created_at: string;
  email: string;
  id: string;
  role: string;
  name: string;
}

type TGetAllResult = {
  users: IUserData[];
  totalPages: number;
  totalItems: number;
  totalAssinantes: number;
  totalMembros: number;
  totalExAssinantes: number;
  currentPage: number;
};
type TGetAllParams = {
  role?: TUsersRole;
  status?: EUsersStatus;
  plan?: TUsersPlan;
  page?: number;
  order?: string | 'desc';
};
const getAll = async ({ role, status, plan, page, order }: TGetAllParams): Promise<TGetAllResult | Error> => {
  try {
    const urlRelativa = `/admins/users?role=${role ?? ''}&status=${status ?? ''}&plan=${plan ?? ''}&page=${page ?? 1}&order=${order ?? 'desc'}`;
    const { data } = await api.get<TGetAllResult>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao listar os registros';
    return new Error(errorMessage);
  }
};

type TGetStaffResponse = {
  currentPage: number;
  pageSize: number;
  staffs: IUserData[];
  totalAdministradores: number;
  totalAutores: number;
  totalColaboradores: number;
  totalEditores: number;
  totalPages: number;
  totalStaff: number;
};
const getAllStaff = async () => {
  try {
    const { data } = await api.get<TGetStaffResponse>('/admins/staff');
    if (data && data.staffs) {
      return data;
    }
    return new Error('Erro ao listar os registros');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao listar os registros';
    return new Error(errorMessage);
  }
};

const inviteMember = async (email: string, role: string): Promise<void | Error> => {
  try {
    await api.post('/admins/staff', { email, role });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao convidar membro';
    return new Error(errorMessage);
  }
};

type bodyUpdate = {
  name: string;
  email: string;
  cellphone?: string;
};

const updateStaffById = async (id: string, body: bodyUpdate): Promise<void | Error> => {
  try {
    await api.put(`/admins/staff/${id}`, body);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar registro';
    return new Error(errorMessage);
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await api.delete(`/admins/delete/${id}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar registro';
    return new Error(errorMessage);
  }
};

export type TProfile = {
  id: string;
  plans: {
    id: string;
  } | null;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  cellphone?: string;
};

export type TMemberProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  cellphone: string;
  plans: {
    id: string;
  } | null
  created_at: Date | null
  payment_created_at: Date | null;
  payment_updated_at: Date | null;
  subscription_created_at: Date | null;
}


const getProfile = async () => {
  try {
    const { data } = await api.get<TProfile>('/admins/profile');
    if (data) {
      return data;
    }
    return new Error('Erro ao buscar o perfil do usuário');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar o perfil do usuário';
    return new Error(errorMessage);
  }
};

const getMemberProfile = async (id: string) => {
  try {
    const { data } = await api.get<TMemberProfile>(`/admins/user/${id}`);
    if (data) {
      return data;
    }
    return new Error('Erro ao buscar o perfil do usuário');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar o perfil do usuário';
    return new Error(errorMessage);
  }
}

const updateProfile = async (body: bodyUpdate) => {
  try {
    await api.put(`/admins/profile/`, body);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar registro';
    return new Error(errorMessage);
  }
};

const updateAvatar = async (File: File): Promise<void | Error> => {
  try {
    const formData = new FormData();
    formData.append('avatar', File);

    await api.patch('/admins/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar registro';
    return new Error(errorMessage);
  }
};

export const UsersService = {
  getAll,
  getAllStaff,
  inviteMember,
  updateAvatar,
  updateStaffById,
  deleteById,
  getProfile,
  getMemberProfile,
  updateProfile,
};
