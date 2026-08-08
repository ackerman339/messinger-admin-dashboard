import { httpClient } from '@/http-client';
import type { UserDto, ListUserMessagesDto } from '@schemas/user-schema';

import type {
  ApiResponse,
  User,
  RestoreLoginKeyResult,
  Conversation,
  ListConversationMessagesResult,
} from '@/types';

export const userService = {
  listUsers: async () => {
    const response = await httpClient.get<ApiResponse<{ users: User[] }>>('/admin/list-users');
    return response.data.result.users;
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

  listUserConversations: async (data: UserDto) => {
    const response = await httpClient.get<ApiResponse<{ conversations: Conversation[] }>>(
      '/admin/list-user-conversations',
      { params: data },
    );
    return response.data.result.conversations;
  },

  listConversationMessages: async (data: ListUserMessagesDto) => {
    const response = await httpClient.get<ApiResponse<ListConversationMessagesResult>>(
      '/admin/list-conversation-messages',
      { params: data },
    );
    return response.data.result;
  },
};
