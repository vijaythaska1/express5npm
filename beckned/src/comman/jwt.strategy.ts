import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'hard!to-guess_secret',
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isActive === false) {
      throw new UnauthorizedException('User account is inactive');
    }
    const { password, ...result } = (user as any).toObject ? (user as any).toObject() : user;
    return result;
  }
}
