import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

const jwtSecret = process.env.JWT_SECRET_KEY || 'fallback_secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };
    super(jwtOptions);
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY env is required!');
    }
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
