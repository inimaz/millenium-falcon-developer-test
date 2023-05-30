import app from '../../src/app';

describe('\'odds\' service', () => {
  it('registered the service', () => {
    const service = app.service('odds');
    expect(service).toBeTruthy();
  });
});
