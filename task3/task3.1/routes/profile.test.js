const request = require('supertest');
const profile = require('./profile');

describe('Profile', () => {
  it('response to GET method', () => {
      return request(profile)
        .get('/api/profile')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
  });
});