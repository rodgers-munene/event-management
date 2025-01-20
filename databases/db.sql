CREATE DATABASE event_management;

USE event_management;

-- Create the Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user ID
    user_name VARCHAR(100) NOT NULL,    -- Username
    user_email VARCHAR(150) UNIQUE NOT NULL, -- User email (must be unique)
    password VARCHAR(255) NOT NULL,   -- Hashed password
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the user was created
);

-- Populate the users table
INSERT INTO users (user_name, user_email, password) 
VALUES 
('John Doe', 'john.doe@example.com', 'hashedpassword1'),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword2'),
('Michael Brown', 'michael.brown@example.com', 'hashedpassword3'),
('Emily Davis', 'emily.davis@example.com', 'hashedpassword4'),
('David Wilson', 'david.wilson@example.com', 'hashedpassword5');

-- Create the Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique event ID
    user_id INT NOT NULL,               -- Foreign key to the Users table
    event_title VARCHAR(200) NOT NULL,  -- Title of the event
    event_description TEXT,             -- Detailed description of the event
    event_start_date DATETIME NOT NULL,  -- Start date and time of the event
    event_end_date DATETIME NOT NULL,    -- End date and time of the event
    event_location VARCHAR(255) NOT NULL, -- Location of the event
    event_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Price for the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for event creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for last update
    image_url VARCHAR(255),           -- URL of the event image
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Cascade delete if user is deleted
);

-- Populate the events table
INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url) 
VALUES 
(3, 'Tech Conference 2025', 'A conference for tech enthusiasts.', '2025-03-15 09:00:00', '2025-03-15 17:00:00', 'New York City', 50.00, 'https://example.com/tech_conf.jpg'),
(4, 'Music Festival', 'A fun music festival for all ages.', '2025-04-20 12:00:00', '2025-04-20 22:00:00', 'Los Angeles', 75.00, 'https://example.com/music_fest.jpg'),
(5, 'Art Exhibition', 'A showcase of local art talent.', '2025-05-05 10:00:00', '2025-05-05 18:00:00', 'Chicago', 25.00, 'https://example.com/art_exhibit.jpg'),
(6, 'Startup Pitch Night', 'Pitch night for entrepreneurs and investors.', '2025-06-10 18:00:00', '2025-06-10 21:00:00', 'San Francisco', 100.00, 'https://example.com/startup_pitch.jpg'),
(7, 'Food Fair', 'A fair featuring international cuisines.', '2025-07-01 11:00:00', '2025-07-01 20:00:00', 'Houston', 30.00, 'https://example.com/food_fair.jpg');

-- Create the Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique payment ID
    event_id INT NOT NULL,             -- Foreign key to the Events table
    participant_name VARCHAR(100) NOT NULL, -- Name of the participant
    participant_number VARCHAR(20) NOT NULL, -- Contact number of the participant
    amount DECIMAL(10, 2) NOT NULL,    -- Payment amount
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for payment
    payment_method VARCHAR(20) ENUM('Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer') NOT NULL, -- Payment method
    transaction_id VARCHAR(100) UNIQUE NOT NULL, -- Unique transaction ID
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE -- Cascade delete if event is deleted
);

-- Populate the payments table
INSERT INTO payments (event_id, participant_name, participant_number, amount, payment_method, transaction_id) 
VALUES 
(26, 'Alice Johnson', '1234567890', 50.00, 'Credit Card', 'TXN12345'),
(27, 'Robert Lee', '9876543210', 50.00, 'PayPal', 'TXN12346'),
(28, 'Sophia Martinez', '1122334455', 75.00, 'M-Pesa', 'TXN12347'),
(29, 'James Anderson', '5566778899', 25.00, 'Bank Transfer', 'TXN12348'),
(30, 'Charlotte Wilson', '2233445566', 100.00, 'Credit Card', 'TXN12349');