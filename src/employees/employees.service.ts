import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  getAllEmployees(user: UserDocument) {
    return user.employees;
  }
  async getSingleEmployee(employee_id: string) {
    const employee = await this.userModel
      .findOne({
        _id: employee_id,
        role: 'employee',
      })
      .select('-__v -invitedBy -password -_id -invites  -employees')
      .lean();
    if (!employee) {
      throw new NotFoundException(
        `Employee with id "${employee_id}" not found.`,
      );
    }
    return { message: 'Employee Found', employee };
  }
}
