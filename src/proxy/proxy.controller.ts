import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request, Response } from 'express';
import { proxyToAuthService } from './proxy.auth';
import { proxyToEventService } from './proxy.event';

@Controller()
export class ProxyController {
  @All('/auth/login')
  async proxyAuthLogin(@Req() req: Request, @Res() res: Response) {
    await proxyToAuthService(req, res, '/login');
  }

  @All('/auth/register')
  async proxyAuthRegister(@Req() req: Request, @Res() res: Response) {
    await proxyToAuthService(req, res, '/register');
  }

  @All('/auth/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR', 'AUDITOR', 'USER')
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    const roles: string[] = (req.user as { roles: string[] }).roles;
    let endpoint: string;

    if (
      roles.includes('ADMIN') ||
      roles.includes('OPERATOR') ||
      roles.includes('AUDITOR')
    ) {
      endpoint = '/users/all';
    } else {
      const userId =
        (req.user as { userId?: string; sub?: string }).userId ??
        (req.user as { sub: string }).sub;
      endpoint = `/users/me/${userId}`;
    }

    await proxyToAuthService(req, res, endpoint);
  }

  @All('/event/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  async eventRegister(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }

  @All('/event/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'ADMIN', 'AUDITOR')
  async eventList(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }

  @All('/reward/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  async rewardRegister(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }

  @All('/reward/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  async rewardList(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }

  @All('/reward/request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'OPERATOR', 'AUDITOR')
  async rewardRequest(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }

  @All('/reward/hist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'OPERATOR', 'AUDITOR')
  async rewardHistory(@Req() req: Request, @Res() res: Response) {
    await proxyToEventService(req, res);
  }
}
