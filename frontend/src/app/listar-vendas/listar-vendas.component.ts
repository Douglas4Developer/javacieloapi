import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistrarVendaComponent } from '../registrar-venda/registrar-venda.component';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-listar-vendas',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgFor,
    CurrencyPipe,
    CommonModule,
    NavbarComponent
],
  templateUrl: './listar-vendas.component.html',
  styleUrls: ['./listar-vendas.component.scss']
})
export class ListarVendasComponent implements OnInit {

  vendas: any[] = [];
  token: string | null = '';

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken'); // Pegando o token armazenado
    this.getVendas();
  }

  getVendas() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Adicionando o token JWT no cabeçalho
    });

    this.http.get<any[]>('http://localhost:8080/vendas', { headers })
      .subscribe((data) => {
        this.vendas = data;
      });
  }
  cancelarVenda(paymentId: string) {
    if (confirm('Tem certeza que deseja cancelar esta venda?')) {
      // Prepare the headers, including the JWT token
      const token = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
  
      // Make the API request to cancel the sale
      this.http.put(`http://localhost:8080/vendas/cancelar/${paymentId}`, {}, { headers, responseType: 'text' })
      .subscribe({
        next: (response) => {
          // Check if the cancellation was successful based on response text
          if (response === 'Success' || response.includes('cancelada com sucesso')) {
            alert('✔ Venda cancelada com sucesso!');
            this.getVendas(); // Refresh the list of sales to reflect the cancellation
          } else {
            // Handle any cases where cancellation failed despite no error
            alert('⚠️ A venda não pôde ser cancelada. Tente novamente.');
          }
        },
        error: (error) => {
          // Handle error during cancellation
          alert(`❌ Erro ao cancelar a venda: ${error.status} - ${error.message}`);
        }
      });
    }
  }
  

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-authorized';
      case 2: return 'status-confirmed';
      case 3: return 'status-denied';
      case 10: return 'status-voided';
      case 11: return 'status-refunded';
      case 12: return 'status-pending';
      case 13: return 'status-aborted';
      case 20: return 'status-scheduled';
      default: return 'status-not-finished';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Autorizado';
      case 2: return 'Confirmado';
      case 3: return 'Negado';
      case 10: return 'Cancelado';
      case 11: return 'Reembolsado';
      case 12: return 'Pendente';
      case 13: return 'Abortado';
      case 20: return 'Agendado';
      default: return 'Não Finalizado';
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegistrarVendaComponent, {
      width: '90%',
      maxWidth: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getVendas(); // Atualiza a lista após fechamento do modal
    });
  }
}
