import { apiClient } from './client';
import type {
  CreateActionBody,
  EscalateChatBody,
  GetActionsResponse,
  GetActionRequestsResponse,
  GetChatDetailResponse,
  GetChatsResponse,
  GetTicketsResponse,
  GetUsersResponse,
  PatchActionRequestBody,
  UpdateActionBody,
} from '@/types/api';

/** Get all chats list */
export const getChats = (): Promise<GetChatsResponse> => {
  return apiClient.get<GetChatsResponse>('/bo/chats');
};

/** Get single chat detail */
export const getChatDetail = (chatId: number): Promise<GetChatDetailResponse> => {
  return apiClient.get<GetChatDetailResponse>(`/bo/chat/${chatId}`);
};

/** Accept or reject an action request */
export const patchActionRequest = (requestId: number, body: PatchActionRequestBody): Promise<void> => {
  return apiClient.patch<void>(`/bo/action_request/${requestId}`, body);
};

/** Escalate a chat to human agent */
export const escalateChat = (chatId: number, body: EscalateChatBody): Promise<void> => {
  return apiClient.patch<void>(`/bo/chat/${chatId}`, body);
};

/** Send a message as support agent (appends to chat history) */
export const sendSupportMessage = (chatId: number, text: string): Promise<void> => {
  return apiClient.post<void>(`/chat/${chatId}/messages`, [{ role: 'assistant', content: text }]);
};

/** Get all actions */
export const getActions = (): Promise<GetActionsResponse> => {
  return apiClient.get<GetActionsResponse>('/bo/actions');
};

/** Create a new action */
export const createAction = (body: CreateActionBody): Promise<void> => {
  return apiClient.post<void>('/bo/action', body);
};

/** Update an existing action */
export const updateAction = (body: UpdateActionBody): Promise<void> => {
  return apiClient.patch<void>('/bo/action', body);
};

/** Get all tickets */
export const getTickets = (): Promise<GetTicketsResponse> => {
  return apiClient.get<GetTicketsResponse>('/bo/tickets');
};

/** Get all action requests */
export const getActionRequests = (): Promise<GetActionRequestsResponse> => {
  return apiClient.get<GetActionRequestsResponse>('/bo/action_requests');
};

/** Get all users */
export const getUsers = (): Promise<GetUsersResponse> => {
  return apiClient.get<GetUsersResponse>('/bo/users');
};
