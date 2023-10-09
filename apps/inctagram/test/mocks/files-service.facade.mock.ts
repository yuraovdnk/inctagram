import { NotificationResult } from '../../../../libs/common/notification/notification-result';

export class FilesServiceFacadeMock {
  queries = {
    getPostImages: jest.fn(() => {
      return NotificationResult.Success([
        {
          id: '4124124',
          size: 5414,
          variant: 'medium',
          url: 'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png',
        },
        {
          id: '34124',
          size: 5464,
          variant: 'medium',
          url: 'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png',
        },
      ]);
    }),
  };
  commands = {
    uploadPostImages: jest.fn(() => {
      return NotificationResult.Success();
    }),
    uploadUserAvatar: jest.fn(() => {
      return NotificationResult.Success({
        fileName:
          'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png',
      });
    }),
  };
}
