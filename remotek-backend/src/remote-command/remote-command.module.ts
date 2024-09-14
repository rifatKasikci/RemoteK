import { Module } from '@nestjs/common';
import { RemoteCommandService } from './remote-command.service';
import { RemoteCommandController } from './remote-command.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    UserModule
  ],
  providers: [RemoteCommandService],
  controllers: [RemoteCommandController],
  exports: [RemoteCommandService],
})
export class RemoteCommandModule { }
