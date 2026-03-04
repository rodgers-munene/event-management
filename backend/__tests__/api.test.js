const request = require('supertest');
const app = require('./test-app');

describe('Health Check API', () => {
  it('GET /health should return server status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Server is running');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Authentication API', () => {
  const testUser = {
    user_name: 'Test User',
    user_email: `test_${Date.now()}@test.com`,
    password: 'TestPass123!',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('userId');
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should fail with invalid email', async () => {
      const invalidUser = { ...testUser, user_email: 'invalid-email' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const weakUser = { ...testUser, password: 'weak' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(weakUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const incompleteUser = { user_name: 'Test' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      await request(app).post('/api/auth/register').send(testUser);

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          user_email: testUser.user_email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userDetails');
      expect(response.body.userDetails.user_email).toBe(testUser.user_email);
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          user_email: 'nonexistent@test.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Events API', () => {
  let authToken;
  let userId;
  let eventId;

  const testEvent = {
    user_id: 1, // Will be updated after login
    event_title: 'Test Conference 2026',
    event_description: 'A test conference for unit testing',
    event_start_date: '2026-06-15T09:00:00.000Z',
    event_end_date: '2026-06-15T17:00:00.000Z',
    event_location: 'Test City',
    event_price: 99.99,
    image_url: 'https://example.com/image.jpg',
  };

  beforeAll(async () => {
    // Register and login to get auth token
    const testUser = {
      user_name: 'Event Tester',
      user_email: `event_tester_${Date.now()}@test.com`,
      password: 'TestPass123!',
    };

    await request(app).post('/api/auth/register').send(testUser);
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        user_email: testUser.user_email,
        password: testUser.password,
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.userDetails.id;
    testEvent.user_id = userId;
  });

  describe('GET /api/events', () => {
    it('should get all events with pagination', async () => {
      const response = await request(app)
        .get('/api/events')
        .query({ limit: 5, page: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('totalPages');
    });

    it('should handle invalid pagination params', async () => {
      const response = await request(app)
        .get('/api/events')
        .query({ limit: -1, page: 0 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/events', () => {
    it('should create an event with valid data', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testEvent);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('eventId');
      expect(response.body.message).toBe('Event created successfully!');

      eventId = response.body.eventId;
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/events')
        .send(testEvent);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid event data', async () => {
      const invalidEvent = { ...testEvent, event_title: 'AB' }; // Too short
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEvent);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with end date before start date', async () => {
      const invalidEvent = {
        ...testEvent,
        event_start_date: '2026-06-15T09:00:00.000Z',
        event_end_date: '2026-06-14T09:00:00.000Z', // Before start
      };
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEvent);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get a specific event', async () => {
      // Create event first
      const createResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testEvent);

      const newEventId = createResponse.body.eventId;

      const response = await request(app).get(`/api/events/${newEventId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(newEventId);
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app).get('/api/events/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event', async () => {
      // Create event first
      const createResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testEvent);

      const newEventId = createResponse.body.eventId;

      const updateData = {
        event_title: 'Updated Conference 2026',
        event_price: 149.99,
      };

      const response = await request(app)
        .put(`/api/events/${newEventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event updated successfully');
    });

    it('should fail to update without auth', async () => {
      const createResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testEvent);

      const response = await request(app)
        .put(`/api/events/${createResponse.body.eventId}`)
        .send({ event_title: 'Hacked Title' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event', async () => {
      // Create event first
      const createResponse = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testEvent);

      const newEventId = createResponse.body.eventId;

      const response = await request(app)
        .delete(`/api/events/${newEventId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event Deleted successfully');
    });
  });
});

describe('Rate Limiting', () => {
  it('should rate limit auth endpoints', async () => {
    // Make 6 rapid login requests (limit is 5)
    for (let i = 0; i < 6; i++) {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          user_email: 'test@test.com',
          password: 'wrong',
        });

      if (i >= 5) {
        expect(response.status).toBe(429); // Too Many Requests
      }
    }
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.title).toBe('Not Found');
  });
});

describe('Security Headers', () => {
  it('should include security headers', async () => {
    const response = await request(app).get('/health');

    expect(response.headers).toHaveProperty('x-dns-prefetch-control');
    expect(response.headers).toHaveProperty('x-frame-options');
    expect(response.headers).toHaveProperty('x-download-options');
    expect(response.headers).toHaveProperty('x-content-type-options');
    expect(response.headers).toHaveProperty('x-xss-protection');
  });
});

// Cleanup after all tests
afterAll(async () => {
  // Close any open connections if needed
  // Jest will handle the cleanup
});
