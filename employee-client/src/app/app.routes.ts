import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { EmployeeComponent } from './Pages/employee/employee.component';

export const routes: Routes = [
  {path: "", component:HomeComponent},
  {path: "inicio", component:HomeComponent},
  {path: "empleado/:id", component:EmployeeComponent},
];
