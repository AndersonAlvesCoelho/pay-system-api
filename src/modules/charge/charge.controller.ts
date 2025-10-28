import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdminOnlyGuard } from 'src/guards/admin-only.Guard';
import { ChargeService } from './charge.service';
import { ChargeResponseDto } from './dto/charge-response.dto';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeStatusDto } from './dto/update-charge-status-dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@ApiTags('Charges')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('charges')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @UseGuards(AdminOnlyGuard)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova cobrança' })
  @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso.', type: ChargeResponseDto })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores podem criar cobranças.' })
  create(@Body() dto: CreateChargeDto, @CurrentUser() user: { userId: string }) {
    return this.chargeService.create(dto, user.userId);
  }

  @UseGuards(AdminOnlyGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todas as cobranças com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de cobranças retornada com sucesso.', type: [ChargeResponseDto] })
  findAll(@Query() pagination: PaginationDto) {
    return this.chargeService.findAll(pagination);
  }

  @UseGuards(AdminOnlyGuard)
  @Get('customer/:id')
  @ApiOperation({ summary: 'Listar todas as cobranças de um cliente específico' })
  @ApiResponse({ status: 200, description: 'Cobranças do cliente retornadas com sucesso.', type: [ChargeResponseDto] })
  findAllByCustomerId(@Param('id') id: string) {
    return this.chargeService.findAllByCustomerId(id);
  }

  @UseGuards(AdminOnlyGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma cobrança pelo ID' })
  @ApiResponse({ status: 200, description: 'Cobrança retornada com sucesso.', type: ChargeResponseDto })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.chargeService.findOne(id);
  }

  @UseGuards(AdminOnlyGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma cobrança' })
  @ApiResponse({ status: 200, description: 'Cobrança atualizada com sucesso.', type: ChargeResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateChargeDto, @CurrentUser() user: { userId: string }) {
    return this.chargeService.update(id, dto, user.userId);
  }

  @UseGuards(AdminOnlyGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma cobrança' })
  @ApiResponse({ status: 200, description: 'Cobrança removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada.' })
  remove(@Param('id') id: string) {
    return this.chargeService.remove(id);
  }

  @UseGuards(AdminOnlyGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar o status de uma cobrança' })
  @ApiResponse({ status: 200, description: 'Status da cobrança atualizado com sucesso.', type: ChargeResponseDto })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateChargeStatusDto, @Req() req: any) {
    const userId = req.user?.id ?? 'system';
    return this.chargeService.updateStatus(id, dto, userId);
  }
}
