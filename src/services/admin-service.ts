import { httpClient } from '@/http-client';
import type { AdminDto } from '@schemas/admin-schema';
import type { UserDto } from '@schemas/user-schema';
import type { ApiResponse, Admin, SignInResult } from '@/types';

export const adminService = {
  signIn: async (data: AdminDto) => {
    const response = await httpClient.post<ApiResponse<SignInResult>>('/admin/sign-in', data);
    return response.data.result;
  },

  createAdmin: async (data: AdminDto) => {
    const response = await httpClient.post<ApiResponse<Admin>>('/admin/create-admin', data);
    return response.data.result;
  },

  listAdmins: async () => {
    const response = await httpClient.get<ApiResponse<{ admins: Admin[] }>>('/admin/list-admins');
    return response.data.result.admins;
  },

  deleteAdmin: async (data: UserDto) => {
    const response = await httpClient.delete<ApiResponse<null>>('/admin/delete-admin', { data });
    return response.data.result;
  },

  logout: () => httpClient.post('/logout'),
};
