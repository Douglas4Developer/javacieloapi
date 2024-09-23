import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-usuario.component.html',
  styleUrls: ['./register-usuario.component.scss'],
})
export class RegisterUsuarioComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.password
      ).subscribe({
        next: () => {
          this.router.navigate(['/login']);  // Redireciona para o login após registro bem-sucedido
        },
        error: err => {
          this.errorMessage = 'Erro no registro. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }
}
