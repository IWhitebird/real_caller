import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/primsa.service';
import { MarkSpamDTO, SearchSpamDTO } from '@modules/spam/dto/spam.dto';
import { JwtDTO } from '@modules/auth/dto/jwt.dto';

@Injectable()
export class SpamService {
  constructor(private prisma: PrismaService) {}

  async search(query : SearchSpamDTO , user : JwtDTO) {
    // console.log({query})
    //Registered Used

    if(query.phone_no) {
        const registeredUser = await this.prisma.spam.findUnique({
            where: {
                phone_no: query.phone_no,
            },
            include : {
                user : true
            }
        });

        if(registeredUser && registeredUser.user) {
            return {
                id : registeredUser.user.id,
                name : registeredUser.user.name,
                phone_no : registeredUser.user.phone_no,
                registered : true
            };

        }
    }

    const res = await this.prisma.spam.findMany({
        where: {
            OR: (query.name || query.phone_no) ? [
                query.phone_no && { phone_no: query.phone_no },
                query.phone_no && {
                    phone_no: {
                        startsWith: query.phone_no,
                        mode: 'insensitive'
                    }
                },
                query.phone_no && {
                    phone_no: {
                        contains: query.phone_no,
                        mode: 'insensitive'
                    }
                },
                query.name && {
                    user: {
                        name: {
                            startsWith: query.name,
                            mode: 'insensitive'
                        }
                    }
                },
                query.name && {
                    user: {
                        name: {
                            contains: query.name,
                            mode: 'insensitive'
                        }
                    }
                },
                query.name && {
                    registered_contacts: {
                        some: {
                            OR : [
                                {
                                    name: {
                                        startsWith: query.name,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    name: {
                                        contains: query.name,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }
                    }
                }
            ].filter(Boolean) as any : undefined
        },
        select : {
            user : {
                select : {
                    id : true,
                    name : true,
                    phone_no : true,
                },
            },
            registered_contacts : {
                select : {
                    id : true,
                    name : true,
                    phone_no : true,
                }
            }
        },
        take: query.limit,  
        skip: (query.page - 1) * query.limit,
    });

    const result = res.map((spam) => {
        if(spam.user) {
            return {
                id : spam.user.id,
                name : spam.user.name,
                phone_no : spam.user.phone_no,
                registered : true
            }
        }
        if(spam.registered_contacts.length === 0) {
            return [];
        }
        return spam.registered_contacts.map((user) => {
            return {
                id : user.id,
                name : user.name,
                phone_no : user.phone_no,
                registered : false
            }
        })       
    }).flat();

    return result;
  }

  async getResult(id: string,  user : JwtDTO) {
    let result = null;

    const registered_user = await this.prisma.user.findUnique({
        where: {
            id : id
        },
        include : {
            spam_info : true,
            contacts : {
                where : {
                    phone_no : user.phone_no
                }
            }
        }
    });

    if(registered_user) {
        if(registered_user.contacts.length === 0) {
            delete registered_user.email;
        }

        delete registered_user.contacts;

        result = registered_user;

    } else {
        const contact_user = await this.prisma.contact.findUnique({
            where: {
                id : id
            },
            include : {
                spam_info : true,
                owner : true
            }
        });
    
        if(contact_user.owner.id !== user.user_id) {
            delete contact_user.owner.email;
        }
    
        result = contact_user;

    }

    //Do spam calculations , if any (future)

    return result;
}


  async markSpam(markSpam : MarkSpamDTO , user : JwtDTO) {
    const result = await this.prisma.$transaction(async (prisma) => {

        const alreadyMarked = await prisma.report.findFirst({
            where: {
                spam_phone_no: markSpam.phone_no,
                user_id: user.user_id
            }
        });

        if(alreadyMarked) {
            throw new Error('Already marked as spam');
        }

        const result = await prisma.spam.upsert({
            where: { phone_no: markSpam.phone_no },
            update: {
                report_count: {
                    increment: 1
                }
            },
            create: {
                phone_no: markSpam.phone_no,
                report_count: 1,
            },
        });

        await prisma.report.create({
            data: {
              spam_phone_no: markSpam.phone_no,
              user_id: user.user_id
            }
        });

        return result;
    });

    return {
      message : 'Spam reported successfully',
      spam : result
    }

  }

}