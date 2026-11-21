import { httpClient } from '@/http-client';
import type { UserDto, ListUserMessagesDto } from '@schemas/user-schema';

import type {
  ApiResponse,
  User,
  RestoreLoginKeyResult,
  Conversation,
  ListConversationMessagesResult,
  Pagination,
  PaginationParams,
} from '@/types';

export const userService = {
  listUsers: async (params: PaginationParams) => {
    const response = await httpClient.get<ApiResponse<Pagination<User>>>('/admin/list-users', {
      params,
    });
    return response.data.result;
  },

  restoreLoginKey: async (data: UserDto) => {
    const response = await httpClient.patch<ApiResponse<RestoreLoginKeyResult>>(
      '/admin/restore-login-key',
      data,
    );
    return response.data.result;
  },

  deleteUser: async (data: UserDto) => {
    const response = await httpClient.delete<ApiResponse<null>>('/admin/delete-user', { data });
    return response.data.result;
  },

  listUserConversations: async (data: UserDto & PaginationParams) => {
    const response = await httpClient.get<ApiResponse<Pagination<Conversation>>>(
      '/admin/list-user-conversations',
      { params: data },
    );
    return response.data.result;
  },

  listConversationMessages: async (data: ListUserMessagesDto) => {
    const response = await httpClient.get<ApiResponse<ListConversationMessagesResult>>(
      '/admin/list-conversation-messages',
      { params: data },
    );
    return response.data.result;
  },
};
