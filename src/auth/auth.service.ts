import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this.userService.findOneByUsername(username);
    const valid = await bcrypt.compare(password, user.password);

    if (user && valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async handleVerifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      console.log(payload);
      return payload;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          key: '',
          data: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(body: { username: string; password: string }) {
    const user = await this.validateUser(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        id: user.id,
      }),
      user: user,
      expiresIn: '1d',
    };
  }

  async register(body: CreateUserDto) {
    const password = await bcrypt.hash(body.password, 10);
    return this.userService.create({ ...body, password });
  }
}
