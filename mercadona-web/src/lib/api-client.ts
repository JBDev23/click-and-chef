import axios, { AxiosError, type AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8082/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function createCartClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Cart-Token': token,
    },
  });
}

export type ProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: Record<string, string>;
};

export function getProblemDetail(error: unknown): ProblemDetail | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }
  const data = (error as AxiosError<ProblemDetail>).response?.data;
  if (!data || typeof data !== 'object') {
    return null;
  }
  return data;
}

export function getErrorMessage(error: unknown, fallback = 'Ha ocurrido un error.'): string {
  const problem = getProblemDetail(error);
  if (problem?.detail) {
    return problem.detail;
  }
  if (axios.isAxiosError(error) && error.message) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
