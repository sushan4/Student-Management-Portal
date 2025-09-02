using Microsoft.Data.SqlClient;
using StudentApi.Models;
using StudentApi.Services;
using System.Data;

namespace StudentApi.Repositories
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student> CreateStudentAsync(Student student);
        Task<Student?> UpdateStudentAsync(int id, Student student);
        Task<bool> DeleteStudentAsync(int id);
        Task<IEnumerable<Student>> SearchStudentsAsync(string searchTerm);
    }

    public class StudentRepository : IStudentRepository
    {
        private readonly DatabaseService _databaseService;

        public StudentRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            var students = new List<Student>();

            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                SELECT StudentId, FirstName, LastName, Email, Phone, DateOfBirth, 
                       Gender, Address, Course, Year, GPA, CreatedAt, UpdatedAt, IsActive
                FROM Students 
                WHERE IsActive = 1 
                ORDER BY LastName, FirstName";

            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                students.Add(MapReaderToStudent(reader));
            }

            return students;
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                SELECT StudentId, FirstName, LastName, Email, Phone, DateOfBirth, 
                       Gender, Address, Course, Year, GPA, CreatedAt, UpdatedAt, IsActive
                FROM Students 
                WHERE StudentId = @StudentId AND IsActive = 1";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@StudentId", id);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapReaderToStudent(reader);
            }

            return null;
        }

        public async Task<Student> CreateStudentAsync(Student student)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                INSERT INTO Students (FirstName, LastName, Email, Phone, DateOfBirth, Gender, Address, Course, Year, GPA)
                OUTPUT INSERTED.StudentId
                VALUES (@FirstName, @LastName, @Email, @Phone, @DateOfBirth, @Gender, @Address, @Course, @Year, @GPA)";

            using var command = new SqlCommand(query, connection);
            AddStudentParameters(command, student);

            var studentId = Convert.ToInt32(await command.ExecuteScalarAsync());
            student.StudentId = studentId;

            return student;
        }

        public async Task<Student?> UpdateStudentAsync(int id, Student student)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                UPDATE Students 
                SET FirstName = @FirstName, LastName = @LastName, Email = @Email, 
                    Phone = @Phone, DateOfBirth = @DateOfBirth, Gender = @Gender, 
                    Address = @Address, Course = @Course, Year = @Year, GPA = @GPA,
                    UpdatedAt = GETUTCDATE()
                WHERE StudentId = @StudentId AND IsActive = 1";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@StudentId", id);
            AddStudentParameters(command, student);

            var rowsAffected = await command.ExecuteNonQueryAsync();

            if (rowsAffected > 0)
            {
                student.StudentId = id;
                student.UpdatedAt = DateTime.UtcNow;
                return student;
            }

            return null;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = "UPDATE Students SET IsActive = 0 WHERE StudentId = @StudentId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@StudentId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Student>> SearchStudentsAsync(string searchTerm)
        {
            var students = new List<Student>();

            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                SELECT StudentId, FirstName, LastName, Email, Phone, DateOfBirth, 
                       Gender, Address, Course, Year, GPA, CreatedAt, UpdatedAt, IsActive
                FROM Students 
                WHERE IsActive = 1 
                AND (FirstName LIKE @SearchTerm OR LastName LIKE @SearchTerm OR Email LIKE @SearchTerm OR Course LIKE @SearchTerm)
                ORDER BY LastName, FirstName";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@SearchTerm", $"%{searchTerm}%");

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                students.Add(MapReaderToStudent(reader));
            }

            return students;
        }

        private static Student MapReaderToStudent(SqlDataReader reader)
        {
            return new Student
            {
                StudentId = Convert.ToInt32(reader["StudentId"]),
                FirstName = reader["FirstName"].ToString() ?? "",
                LastName = reader["LastName"].ToString() ?? "",
                Email = reader["Email"].ToString() ?? "",
                Phone = reader["Phone"] == DBNull.Value ? null : reader["Phone"].ToString(),
                DateOfBirth = Convert.ToDateTime(reader["DateOfBirth"]),
                Gender = reader["Gender"].ToString() ?? "",
                Address = reader["Address"].ToString() ?? "",
                Course = reader["Course"].ToString() ?? "",
                Year = Convert.ToInt32(reader["Year"]),
                GPA = Convert.ToDecimal(reader["GPA"]),
                CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                UpdatedAt = Convert.ToDateTime(reader["UpdatedAt"]),
                IsActive = Convert.ToBoolean(reader["IsActive"])
            };
        }

        private static void AddStudentParameters(SqlCommand command, Student student)
        {
            command.Parameters.AddWithValue("@FirstName", student.FirstName);
            command.Parameters.AddWithValue("@LastName", student.LastName);
            command.Parameters.AddWithValue("@Email", student.Email);
            command.Parameters.AddWithValue("@Phone", string.IsNullOrEmpty(student.Phone) ? DBNull.Value : student.Phone);
            command.Parameters.AddWithValue("@DateOfBirth", student.DateOfBirth);
            command.Parameters.AddWithValue("@Gender", student.Gender);
            command.Parameters.AddWithValue("@Address", student.Address);
            command.Parameters.AddWithValue("@Course", student.Course);
            command.Parameters.AddWithValue("@Year", student.Year);
            command.Parameters.AddWithValue("@GPA", student.GPA);
        }
    }
}
