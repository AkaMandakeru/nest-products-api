import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put, UseInterceptors, UploadedFile, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { CompaniesService } from '../companies/companies.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: User) {
    // Check if user has a company
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before adding products');
    }
    const company = await this.companiesService.findByUserId(user.id);
    return this.productsService.create(createProductDto, user.id, company._id.toString());
  }

  @Get()
  async findAll(@CurrentUser() user: User, @Query() query: ListProductsDto) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before viewing products');
    }
    return this.productsService.findAll(user.id, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before viewing products');
    }
    return this.productsService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before updating products');
    }
    return this.productsService.update(id, updateProductDto, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before deleting products');
    }
    return this.productsService.remove(id, user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    const hasCompany = await this.companiesService.hasCompany(user.id);
    if (!hasCompany) {
      throw new BadRequestException('You must register your company before uploading products');
    }
    const company = await this.companiesService.findByUserId(user.id);
    return this.productsService.processUploadedFile(file, user.id, company._id.toString());
  }
}
