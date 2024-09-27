import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Employee } from '../Models/Employee';
import { ResponseAPI } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Employee";

  constructor() { }

  list() {
    return this.http.get<Employee[]>(this.apiUrl);
  }
  get(id: number) {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }
  create(employee: Employee) {
    return this.http.post<ResponseAPI>(this.apiUrl, employee);
  }
  update(employee: Employee) {
    return this.http.put<ResponseAPI>(this.apiUrl, employee);
  }
  delete(id: number) {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}