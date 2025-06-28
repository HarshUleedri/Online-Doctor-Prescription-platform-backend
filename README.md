# Online Prescription Platform - Backend

A secure and scalable backend service for managing online prescriptions, connecting patients with healthcare providers through a digital platform.

## 🏥 Overview

This backend service provides a comprehensive API for an online prescription platform that enables:

- Patient registration and profile management
- Doctor verification and consultation scheduling
- Secure prescription creation and management
- Pharmacy integration for prescription fulfillment
- Real-time notifications and communication
- Compliance with healthcare regulations (HIPAA, FDA)

## 🚀 Features

### Core Functionality

- **User Management**: Multi-role authentication (Patients, Doctors, Pharmacists, Admins)
- **Prescription Workflow**: Complete prescription lifecycle from consultation to fulfillment
- **Medical Records**: Secure patient health record management
- **Telemedicine**: Video consultation integration
- **Pharmacy Network**: Integration with certified pharmacies
- **Payment Processing**: Secure payment handling for consultations and medications
- **Audit Logging**: Comprehensive activity tracking for compliance

### Security & Compliance

- End-to-end encryption for sensitive medical data
- HIPAA-compliant data handling
- Two-factor authentication
- Role-based access control (RBAC)
- API rate limiting and security monitoring
- Secure file storage for medical documents

## 🛠 Technology Stack

### Backend Framework

- **Node.js** with **Express.js** - RESTful API development
- **TypeScript** - Type-safe development
- **Socket.io** - Real-time communication

### Database

- **PostgreSQL** - Primary database for structured data
- **Redis** - Caching and session management
- **MongoDB** - Document storage for medical files

### Authentication & Security

- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Helmet.js** - Security headers
- **express-rate-limit** - API rate limiting

### Third-party Integrations

- **Twilio** - SMS notifications and video calls
- **SendGrid** - Email notifications
- **Stripe** - Payment processing
- **AWS S3** - File storage
- **Firebase** - Push notifications

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- PostgreSQL (v14.0 or higher)
- Redis (v6.0 or higher)
- MongoDB (v5.0 or higher)
- Docker and Docker Compose (optional)

## 🔧 Installation

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/prescription-platform-backend.git
   cd prescription-platform-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with the following variables:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1

   # Database URLs
   DATABASE_URL=postgresql://username:password@localhost:5432/prescription_db
   REDIS_URL=redis://localhost:6379
   MONGODB_URL=mongodb://localhost:27017/prescription_docs

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d

   # Third-party API Keys
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   SENDGRID_API_KEY=your-sendgrid-key
   STRIPE_SECRET_KEY=your-stripe-secret

   # AWS Configuration
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_S3_BUCKET=your-s3-bucket-name
   AWS_REGION=us-east-1

   # Encryption
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

4. **Database Setup**

   ```bash
   # Run database migrations
   npm run migrate

   # Seed initial data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

This will start all required services including the API server, PostgreSQL, Redis, and MongoDB.

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.prescriptionplatform.com/api/v1
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with token

#### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/upload-document` - Upload verification documents
- `GET /users/notifications` - Get user notifications

#### Doctors

- `GET /doctors` - Get available doctors
- `GET /doctors/:id` - Get doctor details
- `POST /doctors/availability` - Set doctor availability
- `GET /doctors/appointments` - Get doctor's appointments

#### Prescriptions

- `POST /prescriptions` - Create new prescription
- `GET /prescriptions` - Get user's prescriptions
- `GET /prescriptions/:id` - Get prescription details
- `PUT /prescriptions/:id/status` - Update prescription status

#### Consultations

- `POST /consultations` - Book consultation
- `GET /consultations` - Get user's consultations
- `PUT /consultations/:id/notes` - Add consultation notes
- `POST /consultations/:id/prescription` - Create prescription from consultation

### Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2025-06-28T10:30:00Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-06-28T10:30:00Z"
}
```

## 🗂 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── validators/      # Input validation schemas
├── types/           # TypeScript type definitions
└── tests/           # Test files

docs/               # API documentation
migrations/         # Database migrations
seeds/             # Database seed files
scripts/           # Build and deployment scripts
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- --grep "Prescription"
```

### Test Types

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete workflow testing

## 🚀 Deployment

### Environment Setup

1. **Staging Environment**

   ```bash
   npm run deploy:staging
   ```

2. **Production Environment**
   ```bash
   npm run deploy:production
   ```

### Health Checks

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Monitoring

- Application logs are centralized using Winston
- Performance monitoring with custom metrics
- Error tracking and alerting

## 🔒 Security Considerations

### Data Protection

- All sensitive data is encrypted at rest
- PII is tokenized when possible
- Regular security audits and penetration testing

### API Security

- Rate limiting per user and IP
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Compliance

- HIPAA compliance for patient data
- SOC 2 Type II certification
- Regular compliance audits

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Maintain 90%+ test coverage
- Document all public APIs
- Use conventional commit messages

### Pull Request Process

1. Update documentation for any API changes
2. Add tests for new functionality
3. Ensure all tests pass
4. Request review from team members

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
