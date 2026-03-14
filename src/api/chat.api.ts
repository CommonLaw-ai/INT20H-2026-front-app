import { apiClient } from './client';
import type { CreateChatRequest, CreateChatResponse, GetChatResponse, SendMessageRequest } from '@/types/api';

/** Create a new chat with initial message */
export const createChat = (body: CreateChatRequest): Promise<CreateChatResponse> => {
  return apiClient.post<CreateChatResponse>('/chat', body);
};

/** Get chat by ID with messages */
export const getChat = (chatId: number): Promise<GetChatResponse> => {
  return apiClient.get<GetChatResponse>(`/chat/${chatId}`);
};

/** Send a message to an existing chat */
export const sendMessage = (chatId: number, body: SendMessageRequest): Promise<void> => {
  return apiClient.post<void>(`/chat/${chatId}`, body);
};
