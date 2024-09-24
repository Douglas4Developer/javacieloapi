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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';


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
    MatIconModule, MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './registrar-venda.component.html',
  styleUrls: ['./registrar-venda.component.scss'],
})
export class RegistrarVendaComponent {
  vendaForm: FormGroup;
  isLoading = false;
  cardFlag: { name: string, icon: string } | null = null;


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
      validadeCartao: ['', [Validators.required, RegistrarVendaComponent.validadeCartaoValidator]], 
      codigoSeguranca: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  } 
  
  // Função que identifica a bandeira do cartão
  onCardInput(event: any): void {
    const cardNumber = event.target.value;
    this.cardFlag = this.identifyCardFlag(cardNumber);
  }

  // Função de lógica para identificar a bandeira
  identifyCardFlag(cardNumber: string) {
    const visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercard = /^5[1-5][0-9]{14}$/;
    const amex = /^3[47][0-9]{13}$/;
    const elo = /^(4011\d{12}|4312\d{12}|4389\d{12}|4514\d{12}|4576\d{12}|5041\d{12}|5066\d{12}|509\d{13}|6277\d{12}|6362\d{12}|650\d{13}|6516\d{12}|6550\d{12})$/;
  
    if (visa.test(cardNumber)) {
      return { name: 'Visa', icon: 'visa-icon' };
    } else if (mastercard.test(cardNumber)) {
      return { name: 'Master', icon: 'mastercard-icon' };
    } else if (amex.test(cardNumber)) {
      return { name: 'American Express', icon: 'amex-icon' };
    } else if (elo.test(cardNumber)) {
      return { name: 'Elo', icon: 'elo-icon' };
    } else {
      return null;
    }
  }
  
  applyDateMask(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 6);
    }

    input.value = value;
  }

  // Função de validação para garantir que a data seja válida
  static validadeCartaoValidator(control: AbstractControl): ValidationErrors | null {
    const datePattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!control.value || !datePattern.test(control.value)) {
      return { invalidDate: true };
    }

    const [month, year] = control.value.split('/');
    const currentDate = new Date();
    const cardDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1);

    // Verifica se a validade do cartão é no futuro
    if (cardDate < currentDate) {
      return { invalidDate: true };
    }

    return null;
  }

  onSubmit() {
    if (this.vendaForm.valid) {
        this.isLoading = true;

        // Defina a bandeira do cartão como null se cardFlag for null
        const formData = {
            ...this.vendaForm.value,
            bandeiraCartao: this.cardFlag ? this.cardFlag.name : null, // Salva null se não houver bandeira
        };

        // Pegue o valor do campo de validade (string no formato MM/AAAA)
        const validadeCartao = this.vendaForm.get('validadeCartao')?.value;

        if (validadeCartao && /^\d{2}\/\d{4}$/.test(validadeCartao)) {
            const [month, year] = validadeCartao.split('/');
            const formattedValidade = `${month}/${year}`;

            formData.validadeCartao = formattedValidade;

            const token = localStorage.getItem('jwtToken');
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            });

            this.http.post('http://localhost:8080/vendas', formData, { headers, responseType: 'text' })
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    const dialogRef = this.dialog.open(SuccessDialogComponent, {
                        width: '400px',
                    });

                    dialogRef.componentInstance.resetFormEvent.subscribe(() => {
                        this.resetForm();
                    });

                    this.snackBar.open('✔ Venda registrada com sucesso!', 'Fechar', {
                        duration: 3000,
                        panelClass: ['success-snackbar'],
                    });
                },
                error: (error) => {
                    this.isLoading = false;
                    this.snackBar.open(`❌ Erro: ${error.status} - ${error.message}`, 'Fechar', {
                        duration: 3000,
                        panelClass: ['error-snackbar'],
                    });
                },
            });
        } else {
            this.isLoading = false;
            this.snackBar.open('❌ Data de validade do cartão inválida.', 'Fechar', {
                duration: 3000,
                panelClass: ['error-snackbar'],
            });
        }
    } else {
        this.snackBar.open('❌ Por favor, preencha o formulário corretamente.', 'Fechar', {
            duration: 3000,
            panelClass: ['error-snackbar'],
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
