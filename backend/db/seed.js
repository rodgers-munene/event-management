const db = require('../config/db');
const bcrypt = require('bcrypt');
const { logger } = require('../config/logger');

/**
 * Seed data for development and testing
 */

const seedUsers = [
  {
    user_name: 'Admin User',
    user_email: 'admin@eventmanagement.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '+1234567890',
    organization: 'Event Management Inc'
  },
  {
    user_name: 'John Event Organizer',
    user_email: 'john@events.com',
    password: 'Organizer123!',
    role: 'organizer',
    phone: '+1234567891',
    organization: 'Tech Events Co'
  },
  {
    user_name: 'Sarah Conference Planner',
    user_email: 'sarah@conferences.com',
    password: 'Planner123!',
    role: 'organizer',
    phone: '+1234567892',
    organization: 'Conference Solutions'
  },
  {
    user_name: 'Mike Attendee',
    user_email: 'mike@attendee.com',
    password: 'Attendee123!',
    role: 'user',
    phone: '+1234567893',
    organization: null
  },
  {
    user_name: 'Emma Participant',
    user_email: 'emma@participant.com',
    password: 'Participant123!',
    role: 'user',
    phone: '+1234567894',
    organization: 'Tech Corp'
  }
];

const seedEvents = [
  {
    event_title: 'Tech Conference 2026',
    event_description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Join industry leaders and tech enthusiasts for three days of inspiring talks and workshops.',
    event_start_date: '2026-06-15 09:00:00',
    event_end_date: '2026-06-15 17:00:00',
    event_location: 'San Francisco, CA',
    event_price: 299.00,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'published',
    capacity: 500
  },
  {
    event_title: 'Music Festival 2026',
    event_description: 'Three-day music festival featuring top artists from around the world. Multiple stages, food vendors, and camping options available.',
    event_start_date: '2026-07-20 12:00:00',
    event_end_date: '2026-07-22 23:00:00',
    event_location: 'Los Angeles, CA',
    event_price: 199.00,
    image_url: 'https://images.unsplash.com/photo-1459749411177-287ce38e8b77?w=800',
    status: 'published',
    capacity: 5000
  },
  {
    event_title: 'Art Exhibition Opening',
    event_description: 'Exclusive preview of contemporary art from emerging artists. Wine and refreshments will be served.',
    event_start_date: '2026-05-10 18:00:00',
    event_end_date: '2026-05-10 21:00:00',
    event_location: 'New York, NY',
    event_price: 50.00,
    image_url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
    status: 'published',
    capacity: 200
  },
  {
    event_title: 'Startup Pitch Night',
    event_description: 'Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and investors.',
    event_start_date: '2026-04-05 18:30:00',
    event_end_date: '2026-04-05 21:00:00',
    event_location: 'Austin, TX',
    event_price: 25.00,
    image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    status: 'published',
    capacity: 100
  },
  {
    event_title: 'Food & Wine Festival',
    event_description: 'Culinary experience featuring renowned chefs and premium wines. Taste dishes from 50+ restaurants.',
    event_start_date: '2026-08-15 11:00:00',
    event_end_date: '2026-08-15 20:00:00',
    event_location: 'Napa Valley, CA',
    event_price: 150.00,
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    status: 'published',
    capacity: 1000
  },
  {
    event_title: 'Yoga & Wellness Retreat',
    event_description: 'Weekend wellness retreat with yoga sessions, meditation workshops, and healthy cooking classes.',
    event_start_date: '2026-09-01 08:00:00',
    event_end_date: '2026-09-03 16:00:00',
    event_location: 'Sedona, AZ',
    event_price: 499.00,
    image_url: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800',
    status: 'published',
    capacity: 50
  },
  {
    event_title: 'Gaming Championship',
    event_description: 'Competitive gaming tournament with prizes worth $50,000. Multiple games and categories.',
    event_start_date: '2026-10-10 10:00:00',
    event_end_date: '2026-10-12 20:00:00',
    event_location: 'Las Vegas, NV',
    event_price: 75.00,
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    status: 'draft',
    capacity: 2000
  },
  {
    event_title: 'Business Networking Mixer',
    event_description: 'Monthly networking event for professionals. Build connections and grow your business.',
    event_start_date: '2026-03-25 17:30:00',
    event_end_date: '2026-03-25 20:00:00',
    event_location: 'Chicago, IL',
    event_price: 0.00,
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee0b2d74ca?w=800',
    status: 'published',
    capacity: 150
  }
];

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');
    console.log('\n🌱 Seeding database...\n');

    // Seed users
    console.log('Seeding users...');
    const userIds = [];
    
    for (const userData of seedUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [result] = await db.query(
        `INSERT INTO users (user_name, user_email, password, phone, organization, role) 
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE user_name = VALUES(user_name)`,
        [userData.user_name, userData.user_email, hashedPassword, userData.phone, userData.organization, userData.role]
      );
      
      // Get user ID (either new or existing)
      const [rows] = await db.query('SELECT id FROM users WHERE user_email = ?', [userData.user_email]);
      userIds.push(rows[0].id);
    }
    console.log(`✓ Seeded ${userIds.length} users\n`);

    // Seed events
    console.log('Seeding events...');
    const eventIds = [];
    
    for (let i = 0; i < seedEvents.length; i++) {
      const eventData = seedEvents[i];
      const organizerId = userIds[i % userIds.length]; // Distribute events among organizers
      
      const [result] = await db.query(
        `INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url, status, capacity) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE event_title = VALUES(event_title)`,
        [organizerId, eventData.event_title, eventData.event_description, eventData.event_start_date, eventData.event_end_date, eventData.event_location, eventData.event_price, eventData.image_url, eventData.status, eventData.capacity]
      );
      
      const [rows] = await db.query('SELECT id FROM events WHERE event_title = ?', [eventData.event_title]);
      eventIds.push(rows[0].id);
    }
    console.log(`✓ Seeded ${eventIds.length} events\n`);

    // Seed registrations
    console.log('Seeding registrations...');
    let registrationCount = 0;
    
    for (const eventId of eventIds) {
      // Register 2-5 random users for each event
      const numRegistrations = Math.floor(Math.random() * 4) + 2;
      const shuffledUsers = [...userIds].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(numRegistrations, shuffledUsers.length); i++) {
        const userId = shuffledUsers[i];
        const status = ['pending', 'confirmed', 'confirmed', 'confirmed'][Math.floor(Math.random() * 4)];
        
        try {
          await db.query(
            `INSERT IGNORE INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)`,
            [userId, eventId, status]
          );
          registrationCount++;
        } catch (error) {
          // Ignore duplicate registrations
        }
      }
    }
    console.log(`✓ Created ${registrationCount} registrations\n`);

    // Seed payments
    console.log('Seeding payments...');
    let paymentCount = 0;
    
    for (const eventId of eventIds) {
      const [eventRows] = await db.query('SELECT event_price FROM events WHERE id = ?', [eventId]);
      const eventPrice = eventRows[0].event_price;
      
      if (eventPrice > 0) {
        const [regRows] = await db.query(
          'SELECT user_id FROM registrations WHERE event_id = ? AND status = "confirmed"',
          [eventId]
        );
        
        for (const reg of regRows.slice(0, 3)) { // Create payments for first 3 registrations
          const [userRows] = await db.query('SELECT user_name FROM users WHERE id = ?', [reg.user_id]);
          const userName = userRows[0].user_name;
          
          const paymentMethods = ['Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer'];
          const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
          const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          try {
            await db.query(
              `INSERT INTO payments (event_id, participant_name, participant_number, amount, payment_method, transaction_id) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [eventId, userName, '+1234567890', eventPrice, paymentMethod, transactionId]
            );
            paymentCount++;
          } catch (error) {
            // Ignore duplicate payments
          }
        }
      }
    }
    console.log(`✓ Created ${paymentCount} payments\n`);

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${userIds.length}`);
    console.log(`   - Events: ${eventIds.length}`);
    console.log(`   - Registrations: ${registrationCount}`);
    console.log(`   - Payments: ${paymentCount}\n`);
    
    console.log('🔐 Test Credentials:');
    console.log('   Admin: admin@eventmanagement.com / Admin123!');
    console.log('   Organizer: john@events.com / Organizer123!');
    console.log('   User: mike@attendee.com / Attendee123!\n');

  } catch (error) {
    logger.error('Database seeding failed', { error: error.message });
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedDatabase, seedUsers, seedEvents };
