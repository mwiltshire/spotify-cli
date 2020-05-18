import Conf from 'conf';

const config = new Conf();

export default {
  get(key: string) {
    const value = config.get(key);
    if (!value) {
      throw new Error(`Unknown config key: ${key}`);
    }
    return value;
  },
  set(key: string, value: any) {
    config.set(key, value);
  }
};
