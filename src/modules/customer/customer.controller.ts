import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdminOnlyGuard } from 'src/guards/admin-only.Guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AdminOnlyGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.', type: CustomerResponseDto })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores podem criar clientes.' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @UseGuards(AdminOnlyGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso.', type: [CustomerResponseDto] })
  findAll(@Query() pagination: PaginationDto) {
    return this.customerService.findAll(pagination);
  }

  @UseGuards(AdminOnlyGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obter um cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente retornado com sucesso.', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @UseGuards(AdminOnlyGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @UseGuards(AdminOnlyGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cliente' })
  @ApiResponse({ status: 200, description: 'Cliente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
