import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import randomatic from 'randomatic';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Invite, InviteDocument } from 'src/schemas/invite.schema';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Invite.name) private inviteModal: Model<InviteDocument>,
  ) {}
  async createInvite(user: UserDocument) {
    try {
      const invite = new this.inviteModal({
        invitedBy: user._id,
        createdAt: new Date(),
        token: randomatic('A0', 20),
      });
      await this.userModel.findByIdAndUpdate(user._id, {
        $push: { invites: invite._id },
      });
      await invite.save();
      return { message: 'Invite created successfully', token: invite.token };
    } catch (error) {
      console.log('error :', error);
      return { message: 'Error creating invite' };
    }
  }

  async getInvites(user: UserDocument) {
    try {
      const invites = await this.inviteModal
        .find({ invitedBy: user._id })
        .select('-__v -invitedBy')
        .lean();
      return { invites };
    } catch (error) {
      console.log('error :', error);
      return { message: 'Error fetching invites' };
    }
  }

  async getSingleInvite(id: string) {
    const InviteToken = await this.inviteModal
      .findOne({ token: id, used: false })
      .select('-__v -invitedBy -_id')
      .lean();
    if (!InviteToken) {
      throw new NotFoundException(
        `Invite link with token "${id}" not found or may have expired.`,
      );
    }
    return { message: 'Invite found', invite: InviteToken };
  }
  async useInvite(
    id: string,
    body: { name: string; email: string; password: string },
  ) {
    const InviteToken = await this.inviteModal.findOne({
      token: id,
      used: false,
    });
    if (!InviteToken) {
      throw new NotFoundException(
        `Invite link with token "${id}" not found or may have expired.`,
      );
    }
    const checkIfUserExists = await this.userModel.findOne({
      $or: [{ email: body.email }],
    });
    if (checkIfUserExists) {
      throw new NotFoundException(
        `User with email "${body.email}" already exists.`,
      );
    }
    InviteToken.used = true;
    InviteToken.usedAt = new Date();
    await InviteToken.save();
    const hashedPassword = await bcrypt.hash(body?.password, 10);
    const createNewEmployee = new this.userModel({
      ...body,
      password: hashedPassword,
      is_verified: true,
      role: 'employee',
      can_invite: false,
      invited_by: InviteToken.invitedBy,
    });
    await createNewEmployee.save();
    await this.userModel.findByIdAndUpdate(InviteToken.invitedBy, {
      $push: { employees: createNewEmployee._id },
    });
    return { message: 'Employee created successfully' };
  }
}
