import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly users: Model<User>) { }

    async findOne(filter: FilterQuery<User>): Promise<UserDocument> {
        if (filter._id) filter._id = new mongoose.Types.ObjectId(filter._id);
        const user = await this.users.findOne(filter);
        return user
    }

    async create(user: Partial<User>): Promise<UserDocument> {
        return this.users.create(user);
    }

    async updateOne(
        userId: string,
        updateFields: UpdateQuery<User>,
    ): Promise<UserDocument> {
        console.log(updateFields);
        return this.users.findByIdAndUpdate(userId, updateFields, {
            new: true,
        });
    }

    async deleteOne(userId: string): Promise<any> {
        return this.users.findByIdAndDelete(userId);
    }

}
