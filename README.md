# FealtyX - Bug & Task Tracker

A comprehensive bug and task tracking application built with Next.js 15, featuring role-based access control for Developers and Managers.

## 🚀 Features

### Authentication & Authorization
- Mock authentication system with Developer and Manager roles
- Role-based dashboard access
- Secure session management using localStorage

### Developer Features
- **Dashboard**: View assigned tasks with filtering and sorting
- **Task Management**: Create, edit, and delete tasks
- **Time Tracking**: Built-in timer and manual time entry
- **Task Status Management**: Mark tasks as closed (requires manager approval)
- **Trend Analysis**: Visual charts showing task trends over time

### Manager Features
- **Overview Dashboard**: Monitor all tasks across the team
- **Approval System**: Approve or reject task closures
- **Team Analytics**: View team performance metrics
- **Priority Distribution**: Visual breakdown of task priorities
- **Time Tracking Reports**: Monitor time spent by all developers

### Core Functionality
- **Task CRUD Operations**: Full create, read, update, delete functionality
- **Priority Levels**: Low, Medium, High priority classification
- **Status Tracking**: Open → In Progress → Pending Approval → Closed workflow
- **Time Logging**: Track time spent on tasks with detailed entries
- **Filtering & Sorting**: Advanced filtering by status, priority, and sorting options
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons
- **State Management**: React Context API
- **Date Handling**: date-fns
- **UUID Generation**: uuid

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fealtyx_fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Accounts

The application includes demo accounts for testing:

### Developer Account
- **Email**: developer1@example.com
- **Password**: password
- **Features**: Task management, time tracking, task creation

### Manager Account
- **Email**: manager@example.com
- **Password**: password
- **Features**: Team oversight, approval system, analytics

## 📱 Usage Guide

### For Developers

1. **Login** with developer credentials
2. **Dashboard**: View your assigned tasks
3. **Create Tasks**: Click "Create Task" to add new tasks
4. **Time Tracking**: Use the built-in timer or manual entry
5. **Task Management**: Edit, delete, or close tasks
6. **Filtering**: Use filters to organize tasks by status or priority

### For Managers

1. **Login** with manager credentials
2. **Overview**: Monitor all team tasks and performance
3. **Approvals**: Review and approve/reject task closures
4. **Analytics**: View team trends and time tracking reports
5. **Priority Management**: Monitor high-priority tasks

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Role-based dashboards
│   ├── login/            # Authentication page
│   ├── tasks/            # Task management pages
│   └── time-tracker/     # Time tracking interface
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main application layout
│   └── TaskCard.tsx     # Task display component
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility functions
│   ├── auth.ts         # Authentication logic
│   └── data.ts         # Data management
└── types/              # TypeScript type definitions
    └── index.ts        # Application types
```

## 🔧 Key Components

### Authentication System
- Mock authentication with predefined users
- Role-based routing and access control
- Persistent sessions using localStorage

### Data Management
- In-memory data storage with sample data
- CRUD operations for tasks and time entries
- Real-time dashboard statistics

### Task Workflow
1. **Open**: Newly created tasks
2. **In Progress**: Tasks being worked on
3. **Pending Approval**: Tasks awaiting manager approval
4. **Closed**: Approved and completed tasks

### Time Tracking
- Real-time timer functionality
- Manual time entry with descriptions
- Daily, weekly, and total time statistics
- Task-specific time logging

## 🎨 Design Philosophy

- **Clean & Minimal**: Flat UI design with neutral colors
- **Responsive**: Mobile-first approach with desktop optimization
- **Intuitive**: Clear navigation and user-friendly interface
- **Consistent**: Uniform spacing, typography, and component styling

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**

### Build for Production
```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- Real backend integration with database
- User registration and profile management
- Email notifications for task updates
- Advanced reporting and analytics
- Team collaboration features
- File attachments for tasks
- Comment system for task discussions

## 📄 License

This project is created for demonstration purposes as part of a technical assessment.

## 🤝 Contributing

This is a demo project, but suggestions and improvements are welcome!

---

**FealtyX** - Streamlining bug tracking and task management for development teams.
