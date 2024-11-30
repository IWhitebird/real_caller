import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/primsa.service';
import { CreateContactsDTO, CreateUserDTO, UpdateUserDTO } from '@modules/user/dto/user.dto';
import { JwtDTO } from '../auth/dto/jwt.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

    async createUser(data: CreateUserDTO) {
        const result = await this.prisma.$transaction(async (prisma) => {
            await prisma.spam.upsert({
                    where: { phone_no: data.phone_no },
                    update: {},
                    create: {
                    phone_no: data.phone_no,
                    report_count: 0,
                },
            });
            return prisma.user.create({
                data: {
                    ...data,
                },
            });
        });
    
        return result;
    }

    async createContact(data : CreateContactsDTO) {
        const result = await this.prisma.$transaction(async (prisma) => {
            await prisma.spam.upsert({
                    where: { phone_no: data.phone_no },
                    update: {},
                    create: {
                    phone_no: data.phone_no,
                    report_count: 0,
                },
            });
            return prisma.contact.create({
                data: {
                    ...data,
                },
            });
        });
    
        return result;
    }
  
}