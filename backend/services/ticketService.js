const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { logger } = require('../config/logger');

class TicketService {
  constructor() {
    this.ticketsDir = path.join(__dirname, '..', 'tickets');
    this.ensureTicketsDirectory();
  }

  ensureTicketsDirectory() {
    if (!fs.existsSync(this.ticketsDir)) {
      fs.mkdirSync(this.ticketsDir, { recursive: true });
      logger.info('Created tickets directory', { path: this.ticketsDir });
    }
  }

  /**
   * Generate unique ticket token
   */
  generateTicketToken(userId, eventId, registrationId) {
    const data = {
      userId,
      eventId,
      registrationId,
      timestamp: Date.now(),
      random: crypto.randomBytes(16).toString('hex'),
    };
    
    return crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'ticket-secret')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Generate QR code for ticket
   */
  async generateTicketQRCode(registrationData, eventData, userData) {
    try {
      const ticketToken = this.generateTicketToken(
        userData.id,
        eventData.id,
        registrationData.id
      );

      // Create ticket data object
      const ticketData = {
        ticketId: registrationData.id,
        eventId: eventData.id,
        eventTitle: eventData.event_title,
        userId: userData.id,
        userName: userData.user_name,
        userEmail: userData.user_email,
        token: ticketToken,
        issuedAt: new Date().toISOString(),
        status: 'valid',
      };

      // Generate QR code as data URL (base64)
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
        ticketId: ticketData.ticketId,
        token: ticketData.token,
        eventId: ticketData.eventId,
      }), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Also save QR code as PNG file
      const fileName = `ticket_${ticketData.ticketId}_${ticketData.token.substring(0, 8)}.png`;
      const filePath = path.join(this.ticketsDir, fileName);
      
      await QRCode.toFile(filePath, JSON.stringify({
        ticketId: ticketData.ticketId,
        token: ticketData.token,
        eventId: ticketData.eventId,
      }), {
        width: 300,
        margin: 2,
      });

      logger.info('Ticket QR code generated', { 
        ticketId: ticketData.ticketId,
        filePath 
      });

      return {
        success: true,
        ticket: ticketData,
        qrCodeDataUrl,
        qrCodeFilePath: filePath,
        downloadUrl: `/api/tickets/download/${ticketData.ticketId}`,
      };
    } catch (error) {
      logger.error('Failed to generate ticket QR code', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate ticket
   */
  async validateTicket(ticketId, token) {
    try {
      // In a real implementation, you would:
      // 1. Query database for registration
      // 2. Verify token matches
      // 3. Check event status
      // 4. Check if ticket already scanned

      const expectedToken = this.generateTicketToken(
        null, // Would get from DB
        null,
        ticketId
      );

      if (token !== expectedToken) {
        return {
          valid: false,
          reason: 'Invalid ticket token',
        };
      }

      return {
        valid: true,
        message: 'Ticket is valid',
      };
    } catch (error) {
      logger.error('Ticket validation error', { error: error.message });
      return {
        valid: false,
        reason: 'Validation error',
        error: error.message,
      };
    }
  }

  /**
   * Mark ticket as scanned/used
   */
  async scanTicket(ticketId, scannerUserId) {
    try {
      // In a real implementation:
      // 1. Update registration status to 'checked_in'
      // 2. Record scan timestamp and scanner
      // 3. Prevent double scanning

      logger.info('Ticket scanned', { ticketId, scannerUserId });
      
      return {
        success: true,
        message: 'Ticket scanned successfully',
      };
    } catch (error) {
      logger.error('Ticket scan error', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get ticket HTML for printing
   */
  generateTicketHTML(ticketData, eventData, qrCodeDataUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @media print {
            body { margin: 0; }
            .ticket { box-shadow: none; }
          }
          body { 
            font-family: Arial, sans-serif; 
            background: #f0f0f0;
            padding: 20px;
          }
          .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { border: 2px solid #667eea; border-radius: 5px; }
          .details { 
            background: #f9f9f9; 
            padding: 20px; 
            border-radius: 5px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #667eea; }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            color: #666;
            font-size: 12px;
          }
          .barcode {
            text-align: center;
            margin-top: 20px;
            font-family: monospace;
            font-size: 14px;
            letter-spacing: 2px;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>🎫 Event Ticket</h1>
            <p>${eventData.event_title}</p>
          </div>
          
          <div class="content">
            <div class="qr-code">
              <img src="${qrCodeDataUrl}" alt="Ticket QR Code" width="200" />
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Attendee:</span>
                <span>${ticketData.userName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span>${ticketData.userEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Event:</span>
                <span>${eventData.event_title}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span>${new Date(eventData.event_start_date).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span>${new Date(eventData.event_start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span>${eventData.event_location}</span>
              </div>
              <div class="detail-row">
                <span class="label">Ticket ID:</span>
                <span>#${ticketData.ticketId}</span>
              </div>
            </div>
            
            <div class="barcode">
              TICKET-${ticketData.ticketId}-${ticketData.token.substring(0, 8).toUpperCase()}
            </div>
          </div>
          
          <div class="footer">
            <p>Please present this ticket at the event entrance. QR code will be scanned for entry.</p>
            <p>For questions, contact event support.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Singleton instance
const ticketService = new TicketService();

module.exports = ticketService;
