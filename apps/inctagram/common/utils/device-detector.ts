import DeviceDetector from 'node-device-detector';

export const detectDevice = async (userAgent: string): Promise<string> => {
  const res = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: true,
  });

  const device = await res.detectAsync(userAgent);
  return `${device.client.name},${device.os.name} ${device.os.version}`;
};
