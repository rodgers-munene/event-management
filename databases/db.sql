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

ALTER TABLE events 
ADD CONSTRAINT chk_event_dates CHECK (event_start_date < event_end_date);

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