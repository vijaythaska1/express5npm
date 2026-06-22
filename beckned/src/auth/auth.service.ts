import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (user.isActive === false) {
        throw new UnauthorizedException('User account is inactive');
      }
      const { password, ...result } = (user as any).toObject ? (user as any).toObject() : user;
      return result;
    }
    return null;
  }

  async login(payload: { email: string; password: string }) {
    const validated = await this.validateUser(payload.email, payload.password);
    if (!validated) throw new UnauthorizedException('Invalid credentials');
    const tokenPayload = { sub: validated['id'] || validated['_id'], email: validated['email'] };
    return { access_token: this.jwtService.sign(tokenPayload) };
  }
}
