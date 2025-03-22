import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { Company } from './schemas/company.schema';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @CurrentUser() user: User) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  findOne(@CurrentUser() user: User) {
    return this.companiesService.findByUserId(user.id);
  }

  @Put()
  update(
    @Body() updateCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companiesService.update(user.id, updateCompanyDto);
  }

  @Get('exists')
  async hasCompany(@CurrentUser() user: User) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    let company: Company | null = null;
    
    if (hasCompany) {
      company = await this.companiesService.findByUserId(user.id);
    }
    
    return { hasCompany, company };
  }
}
