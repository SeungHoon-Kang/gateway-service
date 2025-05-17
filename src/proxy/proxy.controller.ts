import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

@Controller()
export class ProxyController {
  @All('/auth/*path')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    console.log('[Gateway] req.body:', req.body);
    console.log('[Gateway] req.originalUrl:', req.originalUrl);

    try {
      const targetUrl = `http://localhost:3001${req.originalUrl}`;

      // host 헤더는 삭제 (필수!)
      const headers = { ...req.headers };
      delete headers.host;
      delete headers['content-length'];
      delete headers.host;

      // axios 동적 요청 방식 (POST, PUT, PATCH, GET 모두 커버)
      const axiosConfig: AxiosRequestConfig = {
        method: req.method,
        url: targetUrl,
        headers,
      };

      // GET/DELETE 외에는 body 추가
      if (!['GET', 'DELETE'].includes(req.method.toUpperCase())) {
        axiosConfig.data = req.body as Record<string, unknown>;
      }

      const response = await axios(axiosConfig);

      res.status(response.status).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res
          .status(error.response?.status || 500)
          .json(error.response?.data || { message: 'Internal server error' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  @All('/event/*path')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async proxyEvent(@Req() req: Request, @Res() res: Response) {
    try {
      const targetUrl = `http://localhost:3002${req.originalUrl}`;
      const headers = { ...req.headers };
      delete headers.host;

      const axiosConfig: AxiosRequestConfig = {
        method: req.method,
        url: targetUrl,
        headers,
      };

      if (!['GET', 'DELETE'].includes(req.method.toUpperCase())) {
        axiosConfig.data = req.body as Record<string, unknown>;
      }

      const response = await axios(axiosConfig);

      res.status(response.status).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res
          .status(error.response?.status || 500)
          .json(error.response?.data || { message: 'Internal server error' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
