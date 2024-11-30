import { faker } from '@faker-js/faker';

export function generateRandomDetails() {
  const randomName: string = faker.internet.username();
  const randomPassword: string = faker.internet.password();
  const randomEmail: string = faker.internet.email();
  let randomPhone: string = faker.phone.number({
    style : 'international'
  });

  //max 15 digit in phone number
    if(randomPhone.length > 15) {
        randomPhone = randomPhone.slice(0, 15);
    }

  return {
    name: randomName,
    phoneNumber: randomPhone,
    password: randomPassword,
    email: randomEmail
  };
}
