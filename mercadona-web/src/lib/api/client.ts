import axios, { AxiosError, isAxiosError } from 'axios';
import type { ProblemDetails } from '@/lib/api/types';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8082';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly problem?: ProblemDetails;

  constructor(message: string, status: number, problem?: ProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = problem?.code;
    this.problem = problem;
  }
}

function extractProblem(error: AxiosError): ProblemDetails | undefined {
  const data = error.response?.data;
  if (data && typeof data === 'object') {
    return data as ProblemDetails;
  }
  return undefined;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (isAxiosError(error)) {
    const problem = extractProblem(error);
    const status = error.response?.status ?? 0;
    const message =
      problem?.detail ??
      problem?.title ??
      error.message ??
      'No se pudo completar la petición.';
    return new ApiError(message, status, problem);
  }
  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }
  return new ApiError('Error desconocido', 0);
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
