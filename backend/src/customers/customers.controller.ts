import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { CompaniesService } from '../companies/companies.service';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @CurrentUser() user: User) {
    // Get user's company
    const company = await this.companiesService.findByUserId(user.id);

    // Check if customer code already exists for this company
    const existingCustomer = await this.customersService.findByCode(
      createCustomerDto.code,
      company._id.toString(),
    );

    if (existingCustomer) {
      throw new BadRequestException('Customer code already exists');
    }

    return this.customersService.create(createCustomerDto, company._id.toString());
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const company = await this.companiesService.findByUserId(user.id);
    return this.customersService.findAll(company._id.toString());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const company = await this.companiesService.findByUserId(user.id);
    return this.customersService.findOne(id, company._id.toString());
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
    @CurrentUser() user: User,
  ) {
    const company = await this.companiesService.findByUserId(user.id);
    return this.customersService.update(id, updateCustomerDto, company._id.toString());
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const company = await this.companiesService.findByUserId(user.id);
    return this.customersService.remove(id, company._id.toString());
  }
}
