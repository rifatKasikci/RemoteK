import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dtos/register.dto';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
 
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) { }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findOne({ email: loginDto.email });
        if (!user) {
            throw new Error('User not found');
        }
        let passwordTrue = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordTrue) throw new UnauthorizedException();

        return {
            access_token: await this.jwtService.signAsync({_id: user._id, firstName: user.firstName, lastName: user.lastName, userQueue: user.userQueue }, {
                expiresIn: '7d',
            }),
        };
    }

    async register(registerDto: RegisterDto) {
        const isExist = await this.userService.findOne({
          email: registerDto.email,
        });
        if (isExist) throw new ForbiddenException('User already exist');
    
        const hashedPassword = await this.hashPassword(registerDto.password);
        const user = await this.userService.create({
          ...registerDto,
          password: hashedPassword,
          userQueue: await this.createRandomQueue(),
        });
    
        return {
            access_token: await this.jwtService.signAsync({_id: user._id, firstName: user.firstName, lastName: user.lastName, userQueue: user.userQueue }, {
                expiresIn: '7d',
            }),
        };
      }

    private async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } 
    
    private async createRandomQueue() {
        return uuidv4();
    }
}
