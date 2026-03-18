# Resume Builder

A full-stack web application that helps users create professional resumes with multiple templates, AI-powered suggestions, and export capabilities.

## 🌟 Features

- **Multiple Resume Templates**: Choose from Modern, Classic, Minimal, and Minimal Image templates
- **AI-Powered Assistance**: Get intelligent suggestions for professional summaries and content using OpenAI
- **PDF Parsing**: Import and parse existing resumes from PDF files
- **Image Upload**: Upload profile pictures with ImageKit integration
- **User Authentication**: Secure login and registration with JWT
- **Resume Management**: Save, edit, and manage multiple resumes
- **Color Customization**: Personalize your resume with custom color themes
- **Real-time Preview**: See your resume changes in real-time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph Client["Frontend - React Client"]
        UI["🎨 UI Components<br/>Forms, Templates,<br/>Dashboard"]
        Redux["📦 Redux Store<br/>Auth State<br/>Resume State"]
        Router["🛣️ React Router<br/>Dashboard<br/>Builder<br/>Preview"]
    end
    
    subgraph API["API Gateway"]
        Axios["📡 Axios Client"]
    end
    
    subgraph Server["Backend - Express Server"]
        Auth["🔐 Auth Controller<br/>Register<br/>Login<br/>JWT Verify"]
        Resume["📄 Resume Controller<br/>CRUD Operations<br/>Resume Management"]
        AI["🤖 AI Controller<br/>Content Suggestions<br/>Professional Text"]
        Middleware["⚙️ Middleware<br/>Auth Guard<br/>Validation<br/>Error Handler"]
    end
    
    subgraph Services["External Services"]
        OpenAI["🧠 OpenAI API<br/>Text Suggestions<br/>Content Enhancement"]
        ImageKit["🖼️ ImageKit<br/>Image Upload<br/>Image Hosting"]
    end
    
    subgraph Database["Database Layer"]
        MongoDB["💾 MongoDB<br/>User Collection<br/>Resume Collection"]
    end
    
    Client -->|HTTP/REST| API
    API -->|Route Requests| Server
    Server -->|Process Requests| Middleware
    Middleware -->|Authenticate| Auth
    Middleware -->|Validate| Resume
    Middleware -->|Process| AI
    Auth -->|Query/Update| MongoDB
    Resume -->|Query/Update| MongoDB
    AI -->|API Call| OpenAI
    Resume -->|Upload/Store| ImageKit
    
    UI -->|Dispatch Actions| Redux
    Redux -->|State Updates| UI
    Router -->|Navigate| UI
    
    style Client fill:#e1f5ff
    style Server fill:#fff3e0
    style Database fill:#f3e5f5
    style Services fill:#e8f5e9
    style API fill:#fce4ec
```

## 🛠️ Tech Stack

### Frontend
- **React** 19.1 - UI library
- **Vite** 7.1 - Fast build tool
- **Redux Toolkit** 2.10 - State management
- **Tailwind CSS** 4.1 - Styling
- **React Router** 7.9 - Client-side routing
- **Axios** 1.13 - HTTP client
- **React Hook Form** 7.66 - Form handling
- **Lucide React** - Icon library
- **React Hot Toast** 2.6 - Notifications
- **React PDFToText** 1.3 - PDF parsing

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1 - Web framework
- **MongoDB** - NoSQL database with Mongoose 8.19
- **JWT** - Authentication tokens
- **Bcrypt** 6.0 - Password hashing
- **OpenAI** 6.9 - AI integration
- **ImageKit** 7.1 - Image management
- **Multer** 2.0 - File uploads
- **CORS** - Cross-origin support

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Kubernetes** - Container orchestration (k8s configuration included)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Docker & Docker Compose (optional, for containerized deployment)
- OpenAI API Key
- ImageKit Account (for image hosting)

## 🚀 Getting Started

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd resume-builder
```

#### 2. Environment Configuration

Create a `.env` file in the root directory:
```env
# MongoDB
MONGO_DB_URI=mongodb://localhost:27017/resume-builder
# Or use Atlas: mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# JWT
JWT_SECRET=your_jwt_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Server
NODE_ENV=development
PORT=3000
```

#### 3. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

#### 4. Start Development Servers

**Backend (from server directory):**
```bash
npm run server
```
The server runs on `http://localhost:3000`

**Frontend (from client directory):**
```bash
npm run dev
```
The client runs on `http://localhost:5173`

### Docker Deployment

#### Using Docker Compose:
```bash
docker-compose up --build
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend on `http://localhost:80`

To stop:
```bash
docker-compose down
```

### Kubernetes Deployment

Deploy to Kubernetes cluster:
```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/mongodb.yml
kubectl apply -f k8s/server.yml
kubectl apply -f k8s/client.yml
```

## 📁 Project Structure

```
resume-builder/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── forms/               # Form components for resume sections
│   │   │   ├── templates/           # Resume template components
│   │   │   └── Home/                # Landing page components
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── ResumeBuilder.jsx    # Main resume builder
│   │   │   └── Preview.jsx          # Resume preview
│   │   ├── app/                     # Redux configuration
│   │   │   └── store.js
│   │   ├── configs/                 # API configuration
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf                   # Nginx config for production
│   ├── vite.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── controllers/                 # Request handlers
│   │   ├── aiController.js          # AI features
│   │   ├── resumeController.js      # Resume CRUD
│   │   └── userController.js        # User management
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/                      # API routes
│   │   ├── aiRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── userRouter.js
│   ├── middleware/                  # Express middleware
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── parseResumeData.js
│   ├── config/                      # Configuration files
│   │   ├── db.js                    # Database connection
│   │   ├── ai.js                    # OpenAI setup
│   │   ├── imageKit.js              # ImageKit setup
│   │   └── multer.js                # File upload config
│   ├── server.js
│   └── package.json
├── k8s/                             # Kubernetes manifests
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secrets.yml
│   ├── client.yml
│   └── server.yml
├── docker-compose.yml
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Features
- `POST /api/ai/suggestions` - Get AI suggestions for resume content

## 📝 Available Scripts

### Client
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Server
```bash
npm start         # Start server
npm run server    # Start with nodemon (auto-reload)
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password encryption
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: JOI schema validation
- **Environment Variables**: Sensitive data in .env file

## 🎨 Resume Templates

1. **Modern Template** - Contemporary design with accent colors
2. **Classic Template** - Professional and clean layout
3. **Minimal Template** - Simple and elegant design
4. **Minimal Image Template** - Minimal design with profile image

## 🚧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check `MONGO_DB_URI` in .env is correct
- For MongoDB Atlas, whitelist your IP address

### Image Upload Issues
- Verify ImageKit credentials in .env
- Check file size limits in multer config

### AI Features Not Working
- Verify OpenAI API key is valid
- Check API quota and rate limits
- Ensure proper JSON formatting in requests

### Docker Build Issues
- Clear Docker cache: `docker system prune`
- Rebuild images: `docker-compose build --no-cache`

## 📦 Building for Production

### Frontend Build
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Backend Build
```bash
cd server
npm install --production
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Include error messages and logs

## 🔄 Deployment Checklist

- [ ] Update environment variables
- [ ] Set up MongoDB (cloud or local)
- [ ] Configure OpenAI API key
- [ ] Set up ImageKit account
- [ ] Build frontend: `npm run build`
- [ ] Start backend server
- [ ] Test all functionality
- [ ] Monitor logs for errors

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Last Updated**: March 2026
