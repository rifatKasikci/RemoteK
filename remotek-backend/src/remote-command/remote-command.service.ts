import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RemoteCommandService {

    constructor(private readonly userService: UserService) { }

    createClient(queue: string): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL],
                queue: queue,
                queueOptions: {
                    durable: true,
                },
            },
        });
    }

    async sendShutDownCommand(userId: string) {
        try {
            const user = await this.userService.findOne({ _id: userId });
            const client = this.createClient(`user.${user.userQueue}.shutdown`);
            client.send({ cmd: 'message' }, "shutdown_command").toPromise();
            return { success: true, message: "Shutdown command sent." };

        } catch (error) {
            console.log(error);
            return { success: false, message: "Error sending shutdown command." };
        }
    }
}
