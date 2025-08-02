# Training Platform Frontend

A modern React-based web application for managing training courses, students, and schedules. This platform provides a comprehensive solution for educational institutions and training organizations to manage their training programs efficiently.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/register system with role-based access
- **Dashboard** - Overview of training activities and statistics
- **Course Management** - Create, read, update, and delete training courses
- **Student Management** - Manage student profiles and enrollments
- **Training Schedule Management** - Organize and schedule training sessions
- **Opt-In/Out System** - Allow students to opt in or out of training programs

### User Roles
- **Administrators/Instructors** - Full access to all features
- **Students** - Limited access to dashboard and opt-in/out functionality

### Technical Features
- **Responsive Design** - Modern UI built with Tailwind CSS
- **Real-time Data** - Dynamic updates using React hooks
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Loading States** - Smooth user experience with loading indicators
- **Form Validation** - Client-side validation for all forms

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.7.1
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.11.0
- **Date Handling**: date-fns 4.1.0
- **Data Tables**: react-data-table-component 7.7.0
- **Date Picker**: react-datepicker 8.4.0
- **Testing**: React Testing Library

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd training-platform-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🏃‍♂️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner in interactive mode |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (one-way operation) |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CourseCRUD.js   # Course management component
│   ├── StudentCRUD.js  # Student management component
│   ├── TrainingScheduleCRUD.js  # Schedule management component
│   ├── OptInOut.js     # Opt-in/out functionality
│   └── ErrorBoundary.js # Error handling component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── CoursesPage.js  # Courses management page
│   ├── StudentsPage.js # Students management page
│   ├── TrainingSchedulesPage.js # Schedule management page
│   └── OptInOutPage.js # Opt-in/out page
├── services/           # API services
│   └── api.js         # HTTP client configuration
├── utils/              # Utility functions
│   └── resizeObserverFix.js # Browser compatibility fix
└── App.js             # Main application component
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory to configure API endpoints:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### API Configuration
The application expects a backend API with the following endpoints:
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /courses` - Fetch courses
- `POST /courses` - Create course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /students` - Fetch students
- `POST /students` - Create student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /training-schedules` - Fetch schedules
- `POST /training-schedules` - Create schedule
- `PUT /training-schedules/:id` - Update schedule
- `DELETE /training-schedules/:id` - Delete schedule

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, transitions, and smooth animations
- **User Feedback**: Loading states, error messages, and success notifications
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🔐 Security Features

- **Protected Routes**: Role-based access control
- **Authentication Context**: Centralized user state management
- **Token-based Auth**: Secure API communication
- **Input Validation**: Client-side form validation
- **Error Boundaries**: Graceful error handling

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project includes:
- Unit tests for components
- Integration tests for user flows
- Error boundary testing
- API service testing

## 📦 Building for Production

Create an optimized production build:
```bash
npm run build
```

The build process:
- Minifies JavaScript and CSS
- Optimizes images and assets
- Generates service worker for PWA features
- Creates static files in the `build/` directory

## 🚀 Deployment

### Static Hosting (Recommended)
- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Zero-config deployment with automatic builds
- **GitHub Pages**: Free hosting for open-source projects

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v0.1.0** - Initial release with core functionality
  - User authentication system
  - Course management
  - Student management
  - Training schedule management
  - Opt-in/out system

---

**Built with ❤️ using React and Tailwind CSS**
