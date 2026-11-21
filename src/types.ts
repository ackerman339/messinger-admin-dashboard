export interface ApiResponse<T> {
  message: string;
  result: T;
}

export interface Pagination<T> {
  page: T[];
  nextCursor: string | null;
}

export type PaginationParams = {
  cursor: string | null;
  limit: number;
};

export interface Admin {
  id: string;
  adminName: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  lastSeenAt: string;
  createdAt: string;
  userCode: string;
  loginKey: string;
}

export interface SignInResult {
  adminName: string;
}

export interface RestoreLoginKeyResult {
  loginKey: string;
}

export type ConversationType = 'PRIVATE' | 'GROUP';

export type Members = {
  id: string;
  user: Pick<User, 'id' | 'username'>;
};

export interface Conversation {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  members: Members[];
}

export type ConversationParticipant = { userId: string; username: string | null };

export type ConversationHistoryDetails = {
  type: ConversationType;
  members: ConversationParticipant[];
};

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
  senderId?: string;
  createdAt: string;
  attachments: MessageAttachment[];
  content: string;
  type: string;
  actorId?: string;
  targetUserId?: string | null;
  metadata?: Record<string, unknown>;
  location?: LocationState;
  deliveries?: { userId: string; status: MessageDeliveryStatus }[];
}

export type MessageDeliveryStatus = 'SENT' | 'DELIVERED' | 'READ';

export type LocationPoint = { latitude: number; longitude: number; capturedAt: number };
export type LocationState = LocationPoint & { expiresAt?: number; stoppedAt?: number };

export interface ListConversationMessagesResult extends Pagination<Message> {
  conversation?: ConversationHistoryDetails | null;
}

export type DownloadDto = {
  attachmentId: string;
};

export type DownloadResult = {
  url: string;
};
