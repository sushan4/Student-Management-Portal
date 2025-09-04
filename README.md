# Student Management System

A comprehensive web application for managing student records built with React.js frontend and C# .NET Web API backend with SQL Server database.

## Features

- **Authentication**: Login page with JWT User Authentication
- **Dashboard**: Overview with statistics cards showing:
  - Total students count
  - New students (last 30 days)
  - Average GPA
  - Total courses offered
- **Student Management**: Complete CRUD operations
  - View all students in a data table
  - Add new students
  - Edit existing student records
  - Delete student data
  - Search and filter functionality
- **Responsive Design**: Works seamlessly across different devices
- **Real-time Updates**: Data refreshes automatically
- **Data Validation**: Comprehensive form validation and error handling


## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **.NET 9 SDK**
- **SQL Server** (LocalDB, Express, or full version)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Student-Management-Portal
   ```

2. **Backend Setup**
   ```bash
   cd backend/StudentApi
   dotnet restore
   dotnet build
   ```

3. **Frontend Setup**
   ```bash
   cd ../..  # Back to root directory
   npm install
   ```

### Database Setup

The application uses SQL Server with automatic database initialization. The backend will create the database and tables automatically on first run.

**Connection String**: Update the connection string in `backend/StudentApi/appsettings.json` if needed according to your mssql server instance:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=StudentManagementDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Running the Application

1. **Start the Backend API**
   ```bash
   cd backend/StudentApi
   dotnet run
   ```
   The API will be available at: `http://localhost:5082`
   Swagger documentation: `http://localhost:5082/swagger`

2. **Start the Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The application will be available at: `http://localhost:5173`

### Default Credentials

For testing purposes, you can use these default credentials:
- **Email**: admin
- **Password**: admin02

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student


