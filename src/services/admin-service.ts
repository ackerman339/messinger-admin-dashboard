import { httpClient } from '@/http-client';
import type { AdminDto } from '@schemas/admin-schema';
import type { UserDto } from '@schemas/user-schema';
import type { ApiResponse, Admin, SignInResult, Pagination, PaginationParams } from '@/types';

export const adminService = {
  signIn: async (data: AdminDto) => {
    const response = await httpClient.post<ApiResponse<SignInResult>>('/admin/sign-in', data);
    return response.data.result;
  },

  createAdmin: async (data: AdminDto) => {
    const response = await httpClient.post<ApiResponse<Admin>>('/admin/create-admin', data);
    return response.data.result;
  },

  listAdmins: async (params: PaginationParams) => {
    const response = await httpClient.get<ApiResponse<Pagination<Admin>>>('/admin/list-admins', {
      params,
    });
    return response.data.result;
  },

  updatePassword: async (data: Pick<AdminDto, 'password'>) => {
    await httpClient.patch('/admin/update-password', data);
  },

  deleteAdmin: async (data: UserDto) => {
    const response = await httpClient.delete<ApiResponse<null>>('/admin/delete-admin', { data });
    return response.data.result;
  },

  logout: () => httpClient.post('/logout'),
};
