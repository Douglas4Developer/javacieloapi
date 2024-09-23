import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from './success-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registrar-venda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './registrar-venda.component.html',
  styleUrls: ['./registrar-venda.component.scss'],
})
export class RegistrarVendaComponent {
  vendaForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    public dialogRef: MatDialogRef<RegistrarVendaComponent>,
    private dialog: MatDialog
  ) {
    this.vendaForm = this.fb.group({
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(1)]],
      numeroCartao: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      validadeCartao: ['', Validators.required],
      codigoSeguranca: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  onSubmit() {
    if (this.vendaForm.valid) {
      this.isLoading = true;

      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('jwtToken');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Include the JWT token in the headers
      });

      this.http.post('http://localhost:8080/vendas', this.vendaForm.value, { headers, responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              width: '400px'
            });

            // Reset the form after success
            dialogRef.componentInstance.resetFormEvent.subscribe(() => {
              this.resetForm();
            });

            this.snackBar.open('✔ Venda registrada com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(`❌ Erro: ${error.status} - ${error.message}`, 'Fechar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('❌ Por favor, preencha o formulário corretamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetForm() {
    this.vendaForm.reset();
    this.vendaForm.get('descricao')?.setValue('');
    this.vendaForm.markAsPristine();
    this.vendaForm.markAsUntouched();
    const descricaoInput = document.getElementById('descricao');
    if (descricaoInput) descricaoInput.focus();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
