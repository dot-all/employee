using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using employee_api.Models;
using employee_api.Data;

namespace employee_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeData _employeeData;
        public EmployeeController(EmployeeData employeeData)
        {
            _employeeData = employeeData;
        }

        [HttpGet]
        public async Task<IActionResult> Employees()
        {
            List<Employee> employees = await _employeeData.Employees();

            return StatusCode(StatusCodes.Status200OK, employees);
        }        
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            Employee employee = await _employeeData.GetEmployee(id);

            return StatusCode(StatusCodes.Status200OK, employee);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            bool response = await _employeeData.CreateEmployee(employee);
            return StatusCode(StatusCodes.Status200OK, new {isSuccess = response});
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmployee([FromBody] Employee employee)
        {
            bool response = await _employeeData.UpdateEmployee(employee);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = response });
        }        
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            bool response = await _employeeData.DeleteEmployee(id);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = response });
        }
    }
}
