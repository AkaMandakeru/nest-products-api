import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompaniesService } from '../companies/companies.service';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    try {
      const company = await this.companiesService.findByUserId(req.user.id);
      return this.customersService.create(company.id, createCustomerDto);
    } catch (error) {
      return null; // Return null if user has no company
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      const company = await this.companiesService.findByUserId(req.user.id);
      return this.customersService.findAll(company.id);
    } catch (error) {
      return []; // Return empty array if user has no company
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const company = await this.companiesService.findByUserId(req.user.id);
      return this.customersService.findOne(company.id, id);
    } catch (error) {
      return null; // Return null if user has no company
    }
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
  ) {
    return this.customersService.update(req.user.companyId, id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.customersService.remove(req.user.companyId, id);
  }
}
