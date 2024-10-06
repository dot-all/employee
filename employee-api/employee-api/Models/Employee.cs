namespace employee_api.Models
{
    public class Employee
    {
        public int IdEmployee { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public int Salary { get; set; }
        public string? DateContract { get; set; }
    }
}
