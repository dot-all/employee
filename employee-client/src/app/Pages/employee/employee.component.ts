import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../Services/employee.service';
import { Router } from '@angular/router';
import { Employee } from '../../Models/Employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {

  @Input("id") idEmployee!: number;
  private employeeService = inject(EmployeeService);
  public formBuild = inject(FormBuilder);

  public formEmployee: FormGroup = this.formBuild.group({
    fullName: [''],
    email: [''],
    salary: [0],
    dateContract: [new Date()]
  });

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.idEmployee != 0) {
      this.employeeService.get(this.idEmployee).subscribe({
        next: (data) => {
          this.formEmployee.patchValue({
            fullName: data.fullName,
            email: data.email,
            salary: data.salary,
            dateContract: new Date(data.dateContract)
          });
        },
        error: (e) => {
          console.error(e.message);
        }
      });
    }
  }

  // Función para formatear el salario en CLP
  formatCurrency(value: number | string): string {
    if (!value) {
      return '';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(Number(value));
  }

  // Función para manejar la entrada de salario y formatearla
  onSalaryInput(event: any): void {
    const input = event.target.value.replace(/[^\d]/g, ''); // Remover cualquier carácter no numérico
    this.formEmployee.get('salary')?.setValue(Number(input), { emitEvent: false }); // Actualiza el FormControl
    event.target.value = this.formatCurrency(input); // Muestra el valor formateado en CLP
  }

  save() {
    const employee: Employee = {
      idEmployee: this.idEmployee,
      fullName: this.formEmployee.value.fullName,
      email: this.formEmployee.value.email,
      salary: this.formEmployee.value.salary,
      dateContract: this.formEmployee.value.dateContract
    };

    if (this.idEmployee == 0) {
      this.employeeService.create(employee).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al crear empleado");
          }
        },
        error: (e) => {
          console.error(e.message);
        }
      });
    } else {
      this.employeeService.update(employee).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al actualizar empleado");
          }
        },
        error: (e) => {
          console.error(e.message);
        }
      });
    }
  }

  back() {
    this.router.navigate(["/"]);
  }
}
