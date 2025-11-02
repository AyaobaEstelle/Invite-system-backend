import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDocument } from 'src/schemas/user.schema';

@Controller('/api/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getEmployees(@Request() req: { user: UserDocument }) {
    return this.employeesService.getAllEmployees(req.user);
  }
  @Get('/:id')
  @UseGuards(AuthGuard)
  getSingleEmployee(
    @Request() req: { user: UserDocument },
    @Param('id') id: string,
  ) {
    return this.employeesService.getSingleEmployee(req.user, id);
  }
}
