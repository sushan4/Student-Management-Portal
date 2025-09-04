using Microsoft.Data.SqlClient;
using StudentApi.Models;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace StudentApi.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;
        private readonly string _masterConnectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") //Get from app settings.json
                ?? "Server=localhost,1433;Database=StudentPortalDB;User Id=sa;Password=StudentsDB123;TrustServerCertificate=true;MultipleActiveResultSets=true";
            
            // Create master connection string for database creation
            var builder = new SqlConnectionStringBuilder(_connectionString);
            var databaseName = builder.InitialCatalog;
            builder.InitialCatalog = "master";
            _masterConnectionString = builder.ConnectionString;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "SiemensStudentPortal"));
            return Convert.ToBase64String(hashedBytes);
        }

        public async Task<bool> InitializeDatabaseAsync()
        {
            try
            {
                // First, create the database if it doesn't exist
                await CreateDatabaseIfNotExistsAsync();
                
                // Then create tables and seed data
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Create Users table
                var createUsersTable = @"
                    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
                    CREATE TABLE Users (
                        UserId INT IDENTITY(1,1) PRIMARY KEY,
                        Username NVARCHAR(50) UNIQUE NOT NULL,
                        PasswordHash NVARCHAR(255) NOT NULL,
                        Email NVARCHAR(200) NOT NULL,
                        FirstName NVARCHAR(100) NOT NULL,
                        LastName NVARCHAR(100) NOT NULL,
                        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
                        IsActive BIT DEFAULT 1
                    )";

                // Create Students table
                var createStudentsTable = @"
                    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Students' AND xtype='U')
                    CREATE TABLE Students (
                        StudentId INT IDENTITY(1,1) PRIMARY KEY,
                        FirstName NVARCHAR(100) NOT NULL,
                        LastName NVARCHAR(100) NOT NULL,
                        Email NVARCHAR(200) UNIQUE NOT NULL,
                        Phone NVARCHAR(20),
                        DateOfBirth DATE NOT NULL,
                        Gender NVARCHAR(10) NOT NULL,
                        Address NVARCHAR(200) NOT NULL,
                        Course NVARCHAR(100) NOT NULL,
                        Year INT NOT NULL,
                        GPA DECIMAL(3,2) DEFAULT 0.00,
                        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
                        UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
                        IsActive BIT DEFAULT 1
                    )";

                using var command = new SqlCommand(createUsersTable, connection);
                await command.ExecuteNonQueryAsync();

                command.CommandText = createStudentsTable;
                await command.ExecuteNonQueryAsync();

                // Insert default admin user if not exists
                var insertAdminUser = @"
                    IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
                    INSERT INTO Users (Username, PasswordHash, Email, FirstName, LastName) 
                    VALUES ('admin', @PasswordHash, 'admin@siemens.com', 'Admin', 'User')";

                var passwordHash = HashPassword("admin123");
                
                command.CommandText = insertAdminUser;
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@PasswordHash", passwordHash);
                await command.ExecuteNonQueryAsync();

                // Insert sample student data
                await InsertSampleDataAsync(connection);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database initialization error: {ex.Message}");
                return false;
            }
        }

        private async Task CreateDatabaseIfNotExistsAsync()
        {
            using var connection = new SqlConnection(_masterConnectionString);
            await connection.OpenAsync();
            
            var command = new SqlCommand(@"
                IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'StudentPortalDB')
                BEGIN
                    CREATE DATABASE StudentPortalDB
                END", connection);
            
            await command.ExecuteNonQueryAsync();
        }

        //Function to insert sample student data on first DB connection
        private async Task InsertSampleDataAsync(SqlConnection connection)
        {
            var checkStudents = "SELECT COUNT(*) FROM Students";
            using var checkCommand = new SqlCommand(checkStudents, connection);
            var result = await checkCommand.ExecuteScalarAsync();
            var count = result != null ? (int)result : 0;

            if (count == 0)
            {
                var insertStudents = @"
                    INSERT INTO Students (FirstName, LastName, Email, Phone, DateOfBirth, Gender, Address, Course, Year, GPA) VALUES
                    ('John', 'Doe', 'john.doe@student.com', '+1-555-0101', '2000-05-15', 'Male', 'USA', 'Computer Science', 3, 3.75),
                    ('Jane', 'Smith', 'jane.smith@student.com', '+1-555-0102', '1999-08-22', 'Female', 'Munich', 'Electrical Engineering', 4, 3.92),
                    ('Sushan', 'Uchil', 'uchilsushan36@gmail.com', '+1-555-0103', '2001-02-10', 'Male', 'Mumbai India', 'Computer Science Engineering', 2, 4.00),
                    ('Sarah', 'Wilson', 'sarah.wilson@student.siemens.com', '+1-555-0104', '2000-11-03', 'Female', 'Hamburg', 'Software Engineering', 3, 3.85),
                    ('David', 'Brown', 'david.brown@student.com', '+1-555-0105', '1998-12-18', 'Male', 'France', 'Data Science', 4, 3.67),
                    ('Emily', 'Davis', 'emily.davis@student.com', '+1-555-0106', '2001-07-25', 'Female', 'USA', 'Computer Science', 2, 3.43),
                    ('Alex', 'Miller', 'alex.miller@student.com', '+1-555-0107', '2000-04-08', 'Male', 'USA', 'Information Technology', 3, 3.78),
                    ('Lisa', 'Garcia', 'lisa.garcia@student.com', '+1-555-0108', '1999-09-14', 'Female', 'UK', 'Cybersecurity', 4, 3.91)";

                using var insertCommand = new SqlCommand(insertStudents, connection);
                await insertCommand.ExecuteNonQueryAsync();
            }
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
