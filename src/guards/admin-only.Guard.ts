import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso negado: apenas administradores podem executar esta ação.');
    }

    return true;
  }
}
