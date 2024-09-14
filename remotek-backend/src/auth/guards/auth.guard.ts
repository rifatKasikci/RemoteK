import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

          request.user = payload;
      } catch (e) {
        throw new UnauthorizedException(e.response || 'Invalid token');
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] =
        request.headers.authorization?.split(' ') ||
        request.cookies.authorization?.split(' ') ||
        [];
      return type === 'Bearer' ? token : undefined;
    }
  }