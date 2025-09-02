using Microsoft.AspNetCore.Mvc;
using StudentApi.Models;
using StudentApi.Repositories;

namespace StudentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;

        public StudentsController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        /// <summary>
        /// Get all students
        /// </summary>
        /// <returns>List of all active students</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            try
            {
                var students = await _studentRepository.GetAllStudentsAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get student by ID
        /// </summary>
        /// <param name="id">Student ID</param>
        /// <returns>Student details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            try
            {
                var student = await _studentRepository.GetStudentByIdAsync(id);
                
                if (student == null)
                {
                    return NotFound($"Student with ID {id} not found");
                }

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Create a new student
        /// </summary>
        /// <param name="student">Student data</param>
        /// <returns>Created student</returns>
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] Student student)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdStudent = await _studentRepository.CreateStudentAsync(student);
                return CreatedAtAction(nameof(GetStudent), new { id = createdStudent.StudentId }, createdStudent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update an existing student
        /// </summary>
        /// <param name="id">Student ID</param>
        /// <param name="student">Updated student data</param>
        /// <returns>Updated student</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Student>> UpdateStudent(int id, [FromBody] Student student)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedStudent = await _studentRepository.UpdateStudentAsync(id, student);
                
                if (updatedStudent == null)
                {
                    return NotFound($"Student with ID {id} not found");
                }

                return Ok(updatedStudent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Delete a student (soft delete)
        /// </summary>
        /// <param name="id">Student ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStudent(int id)
        {
            try
            {
                var success = await _studentRepository.DeleteStudentAsync(id);
                
                if (!success)
                {
                    return NotFound($"Student with ID {id} not found");
                }

                return Ok(new { message = "Student deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Search students by name, email, or course
        /// </summary>
        /// <param name="term">Search term</param>
        /// <returns>List of matching students</returns>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Student>>> SearchStudents([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term cannot be empty");
                }

                var students = await _studentRepository.SearchStudentsAsync(term);
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get student statistics
        /// </summary>
        /// <returns>Student statistics</returns>
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            try
            {
                var students = await _studentRepository.GetAllStudentsAsync();
                var studentList = students.ToList();

                var stats = new
                {
                    TotalStudents = studentList.Count,
                    AverageGPA = studentList.Any() ? Math.Round(studentList.Average(s => (double)s.GPA), 2) : 0,
                    CourseDistribution = studentList.GroupBy(s => s.Course)
                        .Select(g => new { Course = g.Key, Count = g.Count() })
                        .OrderByDescending(x => x.Count)
                        .ToList(),
                    YearDistribution = studentList.GroupBy(s => s.Year)
                        .Select(g => new { Year = g.Key, Count = g.Count() })
                        .OrderBy(x => x.Year)
                        .ToList(),
                    GenderDistribution = studentList.GroupBy(s => s.Gender)
                        .Select(g => new { Gender = g.Key, Count = g.Count() })
                        .ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
