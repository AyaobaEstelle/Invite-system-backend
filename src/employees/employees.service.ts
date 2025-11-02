import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getAllEmployees(adminUser: UserDocument) {
    return adminUser.employees;
  }

  async getSingleEmployee(adminUser: UserDocument, employee_id: string) {
    if (adminUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can view employee details');
    }

    if (!isValidObjectId(employee_id)) {
      throw new BadRequestException('Invalid employee id format');
    }

    const employee = await this.userModel
      .findOne({
        _id: employee_id,
        role: 'employee',
      })
      .select('-__v -password -invites -employees')
      .populate('invited_by', 'name email role')
      .lean();

    if (!employee) {
      throw new NotFoundException(
        `Employee with id "${employee_id}" not found.`,
      );
    }

    return { message: 'Employee Found', employee };
  }
}
