import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import randomatic from 'randomatic';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Invite, InviteDocument } from 'src/schemas/invite.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    private readonly mailService: MailService,
  ) {}

  async createInvite(adminUser: UserDocument, email: string) {
    if (!email) throw new BadRequestException('Email is required.');

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(
        `User with email "${email}" already exists.`,
      );
    }

    const token = randomatic('A0', 20);

    const invite = new this.inviteModel({
      invitedBy: adminUser._id,
      email,
      token,
      createdAt: new Date(),
    });

    await invite.save();

    await this.userModel.findByIdAndUpdate(adminUser._id, {
      $push: { invites: invite._id },
    });

    const emailResult = await this.mailService.sendInviteEmail(email, token);

    if (!emailResult.success) {
      this.logger.warn(`Invite created but email failed: ${emailResult.error}`);
    }

    return {
      message: emailResult.success
        ? 'Invite created and email sent successfully'
        : 'Invite created but failed to send email',
      email,
      token,
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    };
  }
  async getInvites(adminUser: UserDocument) {
    try {
      const invites = await this.inviteModel
        .find({ invitedBy: adminUser._id })
        .select('-__v -invitedBy')
        .lean();
      return { invites };
    } catch (error) {
      console.error('Error fetching invites:', error);
      throw new Error('Error fetching invites');
    }
  }

  async getSingleInvite(token: string) {
    const invite = await this.inviteModel
      .findOne({ token, used: false })
      .select('-__v -invitedBy -_id')
      .lean();

    if (!invite) {
      throw new NotFoundException(
        `Invite link with token "${token}" not found or may have expired.`,
      );
    }

    return { message: 'Invite found', invite };
  }

  async useInvite(token: string, body: { fullName: string; password: string }) {
    const invite = await this.inviteModel.findOne({ token, used: false });
    if (!invite) {
      throw new NotFoundException(
        `Invite link with token "${token}" not found or may have expired.`,
      );
    }

    const { email, invitedBy } = invite;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(
        `User with email "${email}" already exists.`,
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newEmployee = new this.userModel({
      name: body.fullName,
      email,
      password: hashedPassword,
      is_verified: true,
      role: 'employee',
      can_invite: false,
      invited_by: invitedBy,
    });

    await newEmployee.save();

    invite.used = true;
    invite.usedAt = new Date();
    await invite.save();

    await this.userModel.findByIdAndUpdate(invitedBy, {
      $push: { employees: newEmployee._id },
    });

    return { message: 'Employee registration completed successfully' };
  }
}
