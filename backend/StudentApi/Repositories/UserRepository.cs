using Microsoft.Data.SqlClient;
using StudentApi.Models;
using StudentApi.Services;
using System.Security.Cryptography;
using System.Text;

namespace StudentApi.Repositories
{
    public interface IUserRepository
    {
        Task<LoginResponse> AuthenticateAsync(LoginRequest loginRequest);
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByUsernameAsync(string username);
    }

    public class UserRepository : IUserRepository
    {
        private readonly DatabaseService _databaseService;

        public UserRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<LoginResponse> AuthenticateAsync(LoginRequest loginRequest)
        {
            try
            {
                using var connection = _databaseService.GetConnection();
                await connection.OpenAsync();

                var query = @"
                    SELECT UserId, Username, PasswordHash, Email, FirstName, LastName, CreatedAt, IsActive
                    FROM Users 
                    WHERE Username = @Username AND IsActive = 1";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Username", loginRequest.Username);

                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var storedPasswordHash = reader["PasswordHash"].ToString() ?? "";
                    var inputPasswordHash = HashPassword(loginRequest.Password);

                    if (storedPasswordHash == inputPasswordHash)
                    {
                        var user = new User
                        {
                            UserId = Convert.ToInt32(reader["UserId"]),
                            Username = reader["Username"].ToString() ?? "",
                            Email = reader["Email"].ToString() ?? "",
                            FirstName = reader["FirstName"].ToString() ?? "",
                            LastName = reader["LastName"].ToString() ?? "",
                            CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                            IsActive = Convert.ToBoolean(reader["IsActive"])
                        };

                        return new LoginResponse
                        {
                            Success = true,
                            Message = "Login successful",
                            User = user,
                            Token = GenerateToken(user)
                        };
                    }
                }

                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = $"Login error: {ex.Message}"
                };
            }
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                SELECT UserId, Username, Email, FirstName, LastName, CreatedAt, IsActive
                FROM Users 
                WHERE UserId = @UserId AND IsActive = 1";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@UserId", id);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    UserId = Convert.ToInt32(reader["UserId"]),
                    Username = reader["Username"].ToString() ?? "",
                    Email = reader["Email"].ToString() ?? "",
                    FirstName = reader["FirstName"].ToString() ?? "",
                    LastName = reader["LastName"].ToString() ?? "",
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                };
            }

            return null;
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            using var connection = _databaseService.GetConnection();
            await connection.OpenAsync();

            var query = @"
                SELECT UserId, Username, Email, FirstName, LastName, CreatedAt, IsActive
                FROM Users 
                WHERE Username = @Username AND IsActive = 1";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@Username", username);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    UserId = Convert.ToInt32(reader["UserId"]),
                    Username = reader["Username"].ToString() ?? "",
                    Email = reader["Email"].ToString() ?? "",
                    FirstName = reader["FirstName"].ToString() ?? "",
                    LastName = reader["LastName"].ToString() ?? "",
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                };
            }

            return null;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "SiemensStudentPortal"));
            return Convert.ToBase64String(hashedBytes);
        }

        private string GenerateToken(User user)
        {
            // Simple token generation for demo purposes
            var tokenData = $"{user.UserId}:{user.Username}:{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}";
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenData));
        }
    }
}
