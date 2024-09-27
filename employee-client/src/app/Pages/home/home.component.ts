import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../Services/employee.service';
import { Employee } from '../../Models/Employee';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);

  public listEmployees: Employee[] = [];
  public displayedColumns: string[] = ["fullName", "email", "salary", "dateContract", "action"];

  constructor(private router: Router) {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.list().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.listEmployees = data;
        }
      },
      error: (e) => {
        console.error("Error al obtener empleados:", e.message);
        alert("No se pudo cargar la lista de empleados. Intente nuevamente más tarde.");
      }
    });
  }

  new() {
    this.router.navigate(["/empleado", 0]);
  }
  
  update(employee: Employee) {
    this.router.navigate(["/empleado", employee.idEmployee]);
  }

  delete(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.delete(employee.idEmployee).subscribe({
          next: (data) => {
            if (data.isSuccess) {
              this.getEmployees();
            }
          },
          error: (e) => {
            console.error("Error al eliminar empleado:", e.message);
          }
        });
      }
    });
  }
}