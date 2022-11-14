import {
  CivilStatus,
  EducationalBackground,
  Fisherfolk,
  Gender,
  Salutation,
  FisherfolkStatus,
} from '@prisma/client';
import { Context, createMockContext } from '../../../context';
import { createFisherfolk } from './Fisherfolk.resolver';
import { MockContext } from '../../../../types/types';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should create fisherfolk record', async () => {
  const fisherfolk: Fisherfolk = {
    id: BigInt(1),
    registrationDate: new Date('2015-05-15'),
    lastName: 'San Jose',
    firstName: 'Mark',
    middleName: 'Santos',
    age: 33,
    salutation: Salutation.MR,
    barangay: 'Brgy. Sambag',
    cityMunicipality: 'Iloilo City',
    province: 'Iloilo',
    contactNum: '09991234567',
    residentYear: 1997,
    dateOfBirth: new Date('1987-08-12'),
    placeOfBirth: 'Iloilo City',
    religion: 'Catholic',
    gender: Gender.MALE,
    civilStatus: CivilStatus.SINGLE,
    numOfChildren: 0,
    nationality: 'FILIPINO',
    educationalBackground: EducationalBackground.COLLEGE,
    personToNotify: 'Nena San Jose',
    ptnRelationship: 'Spouse',
    ptnAddress: 'Brgy. Sambag, Jaro Iloilo City',
    ptnContactNum: '09991234567',
    status: FisherfolkStatus.ACTIVE,
    isArchive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockCtx.prisma.fisherfolk.create.mockResolvedValue(fisherfolk);

  const input = {
    registrationDate: new Date('2015-05-15'),
    lastName: 'San Jose',
    firstName: 'Mark',
    middleName: 'Santos',
    age: 33,
    salutation: Salutation.MR,
    barangay: 'Brgy. Sambag',
    cityMunicipality: 'Iloilo City',
    province: 'Iloilo',
    contactNum: '09991234567',
    residentYear: 1997,
    dateOfBirth: new Date('1987-08-12'),
    placeOfBirth: 'Iloilo City',
    religion: 'Catholic',
    gender: Gender.MALE,
    civilStatus: CivilStatus.SINGLE,
    numOfChildren: 0,
    nationality: 'filipino',
    educationalBackground: EducationalBackground.COLLEGE,
    personToNotify: 'Nena San Jose',
    ptnRelationship: 'Spouse',
    ptnAddress: 'Brgy. Sambag, Jaro Iloilo City',
    ptnContactNum: '09991234567',
    status: FisherfolkStatus.ACTIVE,
    isArchive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await expect(createFisherfolk(input, ctx)).resolves.toEqual(fisherfolk);

  expect(ctx.prisma.fisherfolk.create).toBeCalledWith({
    data: {
      ...input,
    },
  });
});
