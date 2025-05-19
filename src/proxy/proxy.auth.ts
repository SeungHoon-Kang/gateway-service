import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

const AUTH_BASE_URL = 'http://localhost:3001/api/v1/auth';

export async function proxyToAuthService(
  req: Request,
  res: Response,
  endpoint: string,
) {
  const targetUrl = `${AUTH_BASE_URL}${endpoint}`;
  const headers = { ...req.headers };
  delete headers.host;
  delete headers['content-length'];

  const axiosConfig: AxiosRequestConfig = {
    method: req.method,
    url: targetUrl,
    headers,
  };

  if (!['GET', 'DELETE'].includes(req.method.toUpperCase())) {
    axiosConfig.data = req.body as Record<string, unknown>;
  }

  try {
    const response = await axios(axiosConfig);
    if (response.data) {
      const { _id, ...rest } = response.data as Record<string, unknown>;
      response.data = rest;
    }
    res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
