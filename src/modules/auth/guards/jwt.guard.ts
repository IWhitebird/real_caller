import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtDTO } from '@modules/auth/dto/jwt.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request): boolean {

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = this.jwtService.verify(token);

    request.user = decoded as JwtDTO;

    return true;
  }

  catch(err: any) {
    console.log(err);
    return false;
  }
}
