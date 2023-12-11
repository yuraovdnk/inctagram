import DeviceDetector from 'node-device-detector';

export const detectDevice = (userAgent: string): string => {
  const res = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: true,
  });

  const device = res.detect(userAgent);
  return `${device.client.name},${device.os.name} ${device.os.version}`;
};
