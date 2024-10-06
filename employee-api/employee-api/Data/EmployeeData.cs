using employee_api.Models;
using System.Data; // Librería para conectarnos a SQL Server
using System.Data.SqlClient;


namespace employee_api.Data
{
    public class EmployeeData
    {
        private readonly string connection;
        public EmployeeData(IConfiguration configuration) // Nos permite acceder al archivo appsettings
        {
            connection = configuration.GetConnectionString("StringSQL");
        }

        // Listar empleados
        public async Task<List<Employee>> Employees()
        {
            List<Employee> employees = new List<Employee>();
            using (var con = new SqlConnection(connection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("SP_LISTEMPLOYEE", con); // Procedimiento almacenado
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        employees.Add(new Employee
                        {
                            IdEmployee = Convert.ToInt32(reader["IdEmployee"]),
                            FullName = reader["Fullname"].ToString(),
                            Email = reader["Email"].ToString(),
                            Salary = Convert.ToInt32(reader["Salary"]),
                            DateContract = reader["DateContract"].ToString(),
                        });
                    }
                }
            }
            return employees;
        }
        // Obtener empleado
        public async Task<Employee> GetEmployee(int Id)
        {
            Employee employee = new Employee();
            using (var con = new SqlConnection(connection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("SP_GETEMPLOYEE", con);
                cmd.Parameters.AddWithValue("@IdEmployee", Id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        employee = new Employee
                        {
                            IdEmployee = Convert.ToInt32(reader["IdEmployee"]),
                            FullName = reader["Fullname"].ToString(),
                            Email = reader["Email"].ToString(),
                            Salary = Convert.ToInt32(reader["Salary"]),
                            DateContract = reader["DateContract"].ToString(),
                        };
                    }
                }
            }
            return employee;
        }
        // Crear empleado
        public async Task<bool> CreateEmployee(Employee employee)
        {
            bool response = true;
            using (var con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("SP_CREATEEMPLOYEE", con);
                cmd.Parameters.AddWithValue("@FullName", employee.FullName);
                cmd.Parameters.AddWithValue("@Email", employee.Email);
                cmd.Parameters.AddWithValue("@Salary", employee.Salary);
                cmd.Parameters.AddWithValue("@DateContract", employee.DateContract);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    response = await cmd.ExecuteNonQueryAsync() > 0 ? true : false; // Retorna el número de filas afectadas
                }
                catch {
                    response = false;
                }
            }
            return response;
        }
        // Actualizar empleado
        public async Task<bool> UpdateEmployee(Employee employee)
        {
            bool response = true;

            using (var con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("SP_UPDATEEMPLOYEE", con);
                cmd.Parameters.AddWithValue("@IdEmployee", employee.IdEmployee);
                cmd.Parameters.AddWithValue("@FullName", employee.FullName);
                cmd.Parameters.AddWithValue("@Email", employee.Email);
                cmd.Parameters.AddWithValue("@Salary", employee.Salary);
                cmd.Parameters.AddWithValue("@DateContract", employee.DateContract);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    response = await cmd.ExecuteNonQueryAsync() > 0 ? true : false; // Retorna el número de filas afectadas
                    System.Diagnostics.Debug.WriteLine(response);
                }
                catch
                {
                    response = false;
                }
            }
            return response;
        }
        // Eliminar empleado
        public async Task<bool> DeleteEmployee(int id)
        {
            bool response = true;
            using (var con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("SP_DELETEEMPLOYEE", con);
                cmd.Parameters.AddWithValue("@IdEmployee", id);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    response = await cmd.ExecuteNonQueryAsync() > 0 ? true : false; // Retorna el número de filas afectadas
                }
                catch
                {
                    response = false;
                }
            }
            return response;
        }
    }
}
