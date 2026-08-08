export interface ApiResponse<T> {
  message: string;
  result: T;
}

export interface Admin {
  id: string;
  adminName: string;
  createdAt: string;
}

export interface SignInResult {
  adminName: string;
}

export interface RestoreLoginKeyResult {
  loginKey: string;
}

export type ConversationType = 'PRIVATE' | 'GROUP';

export interface Conversation {
  id: string;
  privateKey: string | null;
  name: string | null;
  type: ConversationType;
  lastMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  storageKey: string;
  fileName: string;
  contentType: string;
  size: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  createdAt: string;
  attachments: MessageAttachment[];
  content: string;
  type: 'MESSAGE' | string;
}

export interface ListConversationMessagesResult {
  messages: Message[];
  nextCursor: string | null;
}

export interface User {
  id: string;
  username: string;
  lastSeenAt: string;
  createdAt: string;
}
