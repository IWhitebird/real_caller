import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/modules/app/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/primsa.service';
import { UserService } from '../src/modules/user/user.service';
import { SpamService } from '../src/modules/spam/spam.service';
import { generateRandomDetails } from './helper/random_gen';

//Script for Creating Data

describe('Simulation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userService: UserService;
  let spamService: SpamService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    spamService = moduleFixture.get<SpamService>(SpamService);
    await app.init();
  });


  it('Create Bunch of Users', async () => {
    const no_of_users = 1000;
    const promises = [];
    for(let i=0; i<no_of_users; i++) {
      const {
        name,
        phoneNumber,
        password,
        email
      } = generateRandomDetails();

      promises.push(
        userService.createUser({
          name,
          phone_no : phoneNumber,
          password,
          email
        })
      );
    }

    await Promise.allSettled(promises);
  });

  it('Create Bunch of Contacts', async () => {
    const users = await prismaService.user.findMany();

    for(let i=0; i < users.length; i++) {
      const user = users[i];
      const temp_promise =[];

      for(let j = 0 ; j < 10 ; j++) {
        const {
          name,
          phoneNumber,
          password,
          email
        } = generateRandomDetails();

        temp_promise.push(
          userService.createContact({
            name,
            phone_no : phoneNumber,
            owner_id : user.id,
            email
          })
        );
      }
      await Promise.allSettled(temp_promise);
    }
  });


  it('report spamming', async () => {
    const users = await prismaService.user.findMany();

    const generated_phone_numbers = Array.from({length: 1000}, () => generateRandomDetails().phoneNumber);

    const all_phone_numbers = new Set([
      ...users.map(user => user.phone_no),
      ...generated_phone_numbers
    ]);
    const all_phone_numbers_array = Array.from(all_phone_numbers);

    const promises = [];

    for(let i = 0 ; i < 10000 ; i++) {
      const random_no = Math.floor(Math.random() * all_phone_numbers_array.length);
      
      const phone_no = all_phone_numbers_array[Math.floor(random_no)];
      const random_user = users[Math.floor(Math.random() * users.length)];

      promises.push(
        spamService.markSpam(
          {
            phone_no
          },
          {
            user_id : random_user.id,
            phone_no: random_user.phone_no
          }
        )
      );
    }

    await Promise.allSettled(promises);
  });

});