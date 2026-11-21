import { httpClient } from '@/http-client';
import type { DownloadDto, ApiResponse, DownloadResult } from '@/types';

export const fileService = {
  downloadAudioBytes: async (attachmentId: string, signal: AbortSignal) => {
    const response = await httpClient.get<ArrayBuffer>('/download', {
      params: { attachmentId, format: 'audio-bytes' },
      responseType: 'arraybuffer',
      signal,
    });
    return response.data;
  },

  downloadFile: async (params: DownloadDto) => {
    const response = await httpClient.get<ApiResponse<DownloadResult>>('/download', {
      params,
    });

    return response.data.result;
  },
};
