const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');
const path = require('path');
const fs = require('fs');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = this.checkConfiguration();
    
    if (this.isConfigured) {
      this.initializeTransporter();
    }
  }

  checkConfiguration() {
    return !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    );
  }

  initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        logger.error('Email service verification failed', { error: error.message });
      } else {
        logger.info('Email service ready', { success });
      }
    });
  }

  /**
   * Send email with optional attachments and HTML template
   */
  async sendEmail({
    to,
    subject,
    html,
    text,
    attachments = [],
    cc = null,
    bcc = null,
  }) {
    if (!this.isConfigured) {
      logger.warn('Email service not configured, skipping email', { to, subject });
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
        attachments,
      };

      if (cc) mailOptions.cc = cc;
      if (bcc) mailOptions.bcc = bcc;

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', { 
        to, 
        subject, 
        messageId: info.messageId 
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Failed to send email', { 
        to, 
        subject, 
        error: error.message 
      });
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Send registration confirmation email
   */
  async sendRegistrationConfirmation(userData, eventData, ticketUrl) {
    const html = this.buildRegistrationEmail(userData, eventData, ticketUrl);
    
    return this.sendEmail({
      to: userData.user_email,
      subject: `Registration Confirmed: ${eventData.event_title}`,
      html,
      text: `You have successfully registered for ${eventData.event_title}`,
    });
  }

  /**
   * Send event update notification
   */
  async sendEventUpdate(userData, eventData, changes) {
    const html = this.buildEventUpdateEmail(userData, eventData, changes);
    
    return this.sendEmail({
      to: userData.user_email,
      subject: `Event Update: ${eventData.event_title}`,
      html,
      text: `There are updates to ${eventData.event_title}`,
    });
  }

  /**
   * Send event reminder (24 hours before)
   */
  async sendEventReminder(userData, eventData) {
    const html = this.buildReminderEmail(userData, eventData);
    
    return this.sendEmail({
      to: userData.user_email,
      subject: `Reminder: ${eventData.event_title} is tomorrow!`,
      html,
      text: `Reminder: ${eventData.event_title} is tomorrow`,
    });
  }

  /**
   * Send waitlist promotion email
   */
  async sendWaitlistPromotion(userData, eventData, deadline) {
    const html = this.buildWaitlistPromotionEmail(userData, eventData, deadline);
    
    return this.sendEmail({
      to: userData.user_email,
      subject: `You're off the waitlist: ${eventData.event_title}`,
      html,
      text: `Good news! A spot is now available for ${eventData.event_title}`,
    });
  }

  /**
   * Send payment receipt
   */
  async sendPaymentReceipt(userData, eventData, paymentData) {
    const html = this.buildPaymentReceiptEmail(userData, eventData, paymentData);
    
    return this.sendEmail({
      to: userData.user_email,
      subject: `Payment Receipt: ${eventData.event_title}`,
      html,
      text: `Payment receipt for ${eventData.event_title}`,
    });
  }

  // Email Templates
  buildRegistrationEmail(user, event, ticketUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${user.user_name},</p>
            <p>You have successfully registered for <strong>${event.event_title}</strong>. We're excited to see you there!</p>
            
            <div class="details">
              <h3>Event Details</h3>
              <div class="detail-row"><span class="label">📅 Date:</span> ${new Date(event.event_start_date).toLocaleDateString()}</div>
              <div class="detail-row"><span class="label">🕐 Time:</span> ${new Date(event.event_start_date).toLocaleTimeString()}</div>
              <div class="detail-row"><span class="label">📍 Location:</span> ${event.event_location}</div>
              <div class="detail-row"><span class="label">💰 Price:</span> $${event.event_price}</div>
            </div>

            ${ticketUrl ? `
              <div style="text-align: center;">
                <a href="${ticketUrl}" class="button">📱 Download Your Ticket</a>
              </div>
            ` : ''}

            <p style="margin-top: 20px;">Please save this email for your records. You'll receive a reminder 24 hours before the event.</p>

            <div class="footer">
              <p>Questions? Reply to this email or contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} Event Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  buildEventUpdateEmail(user, event, changes) {
    const changesList = Object.entries(changes)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>📢 Event Update</h2>
          <p>Hi ${user.user_name},</p>
          <p>There are updates to <strong>${event.event_title}</strong>:</p>
          <ul>${changesList}</ul>
          <p>We apologize for any inconvenience this may cause.</p>
        </div>
      </body>
      </html>
    `;
  }

  buildReminderEmail(user, event) {
    return `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>⏰ Event Reminder</h2>
          <p>Hi ${user.user_name},</p>
          <p>This is a friendly reminder that <strong>${event.event_title}</strong> is happening tomorrow!</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>📅 Date:</strong> ${new Date(event.event_start_date).toLocaleDateString()}</p>
            <p><strong>🕐 Time:</strong> ${new Date(event.event_start_date).toLocaleTimeString()}</p>
            <p><strong>📍 Location:</strong> ${event.event_location}</p>
          </div>
          <p>See you there!</p>
        </div>
      </body>
      </html>
    `;
  }

  buildWaitlistPromotionEmail(user, event, deadline) {
    return `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🎉 Good News!</h2>
          <p>Hi ${user.user_name},</p>
          <p>A spot has opened up for <strong>${event.event_title}</strong> and you've been moved off the waitlist!</p>
          <p><strong>Please confirm your attendance by ${deadline}</strong> or your spot will be offered to the next person.</p>
          <a href="#" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Confirm Attendance</a>
        </div>
      </body>
      </html>
    `;
  }

  buildPaymentReceiptEmail(user, event, payment) {
    return `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🧾 Payment Receipt</h2>
          <p>Hi ${user.user_name},</p>
          <p>Your payment for <strong>${event.event_title}</strong> has been processed successfully.</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Amount:</strong> $${payment.amount}</p>
            <p><strong>Payment Method:</strong> ${payment.payment_method}</p>
            <p><strong>Transaction ID:</strong> ${payment.transaction_id}</p>
            <p><strong>Date:</strong> ${new Date(payment.payment_date).toLocaleDateString()}</p>
          </div>
          <p>Thank you for your payment!</p>
        </div>
      </body>
      </html>
    `;
  }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
