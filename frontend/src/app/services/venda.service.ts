import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = 'http://localhost:8080/vendas';

  constructor(private http: HttpClient) { }

  registrarVenda(venda: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, venda);
  }

  listarVendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
