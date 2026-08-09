import { httpClient } from '@/http-client';
import type { DownloadDto, ApiResponse, DownloadResult } from '@/types';

export const fileService = {
  downloadFile: async (params: DownloadDto) => {
    const response = await httpClient.get<ApiResponse<DownloadResult>>('/download', {
      params,
    });

    return response.data.result;
  },
};
