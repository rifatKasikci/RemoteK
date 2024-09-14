import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { RemoteCommandService } from './remote-command.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';

@Controller('remote-command')
@UseGuards(AuthGuard)
export class RemoteCommandController {

    constructor(private readonly remoteCommandService: RemoteCommandService) {}

    @HttpCode(HttpStatus.OK)
    @Post('shutdown')
    async sendShutDownCommand(@Req() req: Request): Promise<any> {
        return await this.remoteCommandService.sendShutDownCommand(req.user._id);
    }
}
