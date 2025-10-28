import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN
  @Post('login')
  @ApiOperation({
    summary: 'Realiza o login de um usuário existente',
    description:
      'Recebe o e-mail e senha do usuário e retorna um token JWT de autenticação junto com os dados básicos do usuário.',
  })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          name: 'Anderson Alves',
          email: 'anderson@email.com',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: LoginAuthDto) {
    return this.authService.login(body.email, body.password);
  }

  // REGISTER
  @Post('register')
  @ApiOperation({
    summary: 'Cria uma nova conta de usuário',
    description:
      'Cadastra um novo usuário no sistema, retornando seu token JWT e os dados básicos do perfil.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          name: 'Anderson Alves',
          email: 'usuario@email.com',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'E-mail já registrado.' })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  // ME
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtém o perfil do usuário autenticado',
    description:
      'Retorna as informações do usuário atualmente autenticado com base no token JWT fornecido no header Authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do usuário autenticado.',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente.' })
  async me(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
