// Adicione um EventEmitter para notificar o RegistrarVendaComponent
import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="success-dialog">
      <mat-icon color="primary" class="success-icon">check_circle</mat-icon>
      <h1>Venda Registrada!</h1>
      <p>O que você deseja fazer agora?</p>
      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="onNewSale()">Nova Venda</button>
        <button mat-stroked-button color="accent" (click)="onListSales()">Listar Vendas</button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog { 
      text-align: center; 
      padding: 20px;
      background-color: #e0f7ea;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .success-icon { 
      font-size: 60px; 
      color: #4caf50;
      margin-bottom: 15px;
    }
    h1 { 
      margin-bottom: 10px; 
      color: #4caf50; 
      font-size: 24px;
      font-weight: bold;
    }
    p { 
      margin-bottom: 25px; 
      font-size: 16px;
      color: #333;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  `]
})
export class SuccessDialogComponent {
  @Output() resetFormEvent = new EventEmitter<void>();

  constructor(private router: Router, public dialogRef: MatDialogRef<SuccessDialogComponent>) {}

// Função para "Nova Venda"
onNewSale(): void {
  this.resetFormEvent.emit();  // Emite o evento para reiniciar o formulário
  this.dialogRef.close();  // Fecha o modal de sucesso, mas mantém o modal de registrar venda
}


// Função para "Listar Vendas"
onListSales(): void {
  this.resetFormEvent.emit();  // Emite o evento para fechar o modal de "Registrar Venda"
  this.dialogRef.close();  // Fecha o modal de sucesso
  setTimeout(() => {
    this.router.navigate(['/listar-vendas']);  // Redireciona após fechar os modais
  }, 100);  // Pequeno atraso para garantir que os modais sejam fechados antes da navegação
}



}
