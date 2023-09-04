import { validate } from 'class-validator';
import { UserProfileDto } from '../user-profile.dto';
import { dtoFieldTest } from '../../../../../../../test/test-helpers/dto-field-test';

const dtoTitle = 'UserProfileDto';
describe(`Testing for ${dtoTitle}`, () => {
  const getMockDto = () => {
    const mockDto = new UserProfileDto();
    mockDto.username = 'Username1';
    mockDto.firstName = 'firstName';
    mockDto.lastName = 'lastName';
    mockDto.city = 'London';
    mockDto.dateOfBirth = '2003-09-01T20:22:39.762Z';
    mockDto.aboutMe = 'About me text...';
    mockDto.avatar =
      'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png';
    return mockDto;
  };
  it('should validate a valid Dto', async () => {
    const errors = await validate(getMockDto());
    errors.length && console.log(errors);
    expect(errors.length).toBe(0); // Expect no errors
  });
  it('should validate a valid Dto if city, avatar, aboutMe equal null', async () => {
    const changedMockDto = getMockDto();
    changedMockDto.city = null;
    changedMockDto.avatar = null;
    changedMockDto.aboutMe = null;

    const errors = await validate(changedMockDto);
    if (errors.length) console.log(errors);
    expect(errors.length).toBe(0); // Expect no errors
  });
  describe('field: username', () => {
    const validValues = [
      'Username',
      'User-name',
      'User_name',
      'Username1',
      'username',
      'USERNAME',
      'Username1-_',
    ];
    const invalidValues = [
      '',
      198954202,
      true,
      null,
      undefined,
      'Vasya',
      'ThisIsTooLongUserNameThisIsTooLongUserName',
      'User name',
      'Анфиса',
    ];
    dtoFieldTest('username', getMockDto(), validValues, invalidValues);
  });
  describe('field: firstName', () => {
    const validValues = [
      'Petrov',
      'Петров',
      "O'Dogherty",
      'el-Madji-Amor',
      'de Beech',
      'O',
    ];
    const invalidValues = [
      '',
      1,
      true,
      undefined,
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij',
      'LastNameWith*',
    ];
    dtoFieldTest('firstName', getMockDto(), validValues, invalidValues);
  });
  describe('field: lastName', () => {
    const validValues = [
      'Petrov',
      'Петров',
      "O'Dogherty",
      'el-Madji-Amor',
      'de Beech',
      'O',
    ];
    const invalidValues = [
      '',
      1,
      true,
      undefined,
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij',
      'LastNameWith*',
    ];
    dtoFieldTest('lastName', getMockDto(), validValues, invalidValues);
  });
  describe('field: city', () => {
    const validValues = [undefined, null, 'London', ''];
    const invalidValues = [1, true];
    dtoFieldTest('city', getMockDto(), validValues, invalidValues);
  });
  describe('field: dateOfBirth', () => {
    const validValues = ['2003-09-01T20:22:39.762Z', '2003'];
    const invalidValues = [
      1,
      true,
      '',
      null,
      undefined,
      '2013-09-01T20:22:39.762Z',
      '2023',
    ];
    dtoFieldTest('dateOfBirth', getMockDto(), validValues, invalidValues);
  });
  describe('field: aboutMe', () => {
    const validValues = ['', null, undefined, 'About me some text..'];
    const invalidValues = [
      1,
      true,
      'About me. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip sdlsdslg,saserd',
    ];
    dtoFieldTest('aboutMe', getMockDto(), validValues, invalidValues);
  });
  describe('field: avatar', () => {
    const validValues = [
      null,
      undefined,
      'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png',
    ];
    const invalidValues = [1, true, 'About me. ', 'https:/s3.eu'];
    dtoFieldTest('avatar', getMockDto(), validValues, invalidValues);
  });
});
