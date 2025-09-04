using Microsoft.AspNetCore.Mvc;
using StudentApi.Services;

namespace StudentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IJwtService jwtService, ILogger<AuthController> logger)
        {
            _jwtService = jwtService;
            _logger = logger;
        }

        /// <summary>
        /// Login endpoint with simple username/password validation
        /// </summary>
        /// <param name="request">Login credentials</param>
        /// <returns>JWT token if login successful</returns>
        [HttpPost("login")]
        public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Login attempt for username: {request.Username}");

                // Simple authentication - for now, check uname and passs and sign JWT
                if (IsValidUser(request.Username, request.Password))
                {
                    var token = _jwtService.GenerateToken(request.Username, GetUserId(request.Username));
                    
                    var response = new LoginResponse
                    {
                        Token = token,
                        Username = request.Username,
                        ExpiresAt = DateTime.UtcNow.AddHours(24)
                    };

                    _logger.LogInformation($"Login successful for username: {request.Username}");
                    return Ok(response);
                }

                _logger.LogWarning($"Login failed for username: {request.Username}");
                return Unauthorized(new { message = "Invalid username or password" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login for username: {request.Username}");
                return StatusCode(500, new { message = "Internal server error during login" });
            }
        }

        /// <summary>
        /// Validate token endpoint
        /// </summary>
        /// <param name="token">JWT token to validate</param>
        /// <returns>Token validation result</returns>
        [HttpPost("validate")]
        public ActionResult ValidateToken([FromBody] ValidateTokenRequest request)
        {
            try
            {
                var principal = _jwtService.ValidateToken(request.Token);
                
                if (principal != null)
                {
                    var username = principal.Identity?.Name;
                    return Ok(new { valid = true, username = username });
                }
                
                return Ok(new { valid = false });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Ok(new { valid = false });
            }
        }

        /// <summary>
        /// Logout endpoint (client-side token removal to redirect to login page)
        /// </summary>
        /// <returns>Success message</returns>
        [HttpPost("logout")]
        public ActionResult Logout()
        {
            
            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Simple user validation - replace with your actual authentication logic
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="password">Password</param>
        /// <returns>True if valid user</returns>
        private bool IsValidUser(string username, string password)
        {
            // Simple hardcoded authentication for demo purposes, check uname and password
            var validUsers = new Dictionary<string, string>
            {
                { "admin", "admin02" },
                { "student", "student123" },
                { "teacher", "teacher123" },
                { "demo", "demo123" }
            };

            return validUsers.ContainsKey(username) && validUsers[username] == password;
        }

        /// <summary>
        /// Get user ID for token generation
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>User ID</returns>
        private string GetUserId(string username)
        {
            // Simple user ID mapping
            var userIds = new Dictionary<string, string>
            {
                { "admin", "1" },
                { "student", "2" },
                { "teacher", "3" },
                { "demo", "4" }
            };

            return userIds.TryGetValue(username, out var userId) ? userId : "0";
        }
    }

    /// <summary>
    /// Login request model
    /// </summary>
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// Login response model
    /// </summary>
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    /// <summary>
    /// Validate token request model
    /// </summary>
    public class ValidateTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}
