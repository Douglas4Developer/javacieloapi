import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RegistrarVendaComponent } from './registrar-venda/registrar-venda.component';
import { ListarVendasComponent } from './listar-vendas/listar-vendas.component';
import { ExibirStatusVendaComponent } from './exibir-status-venda/exibir-status-venda.component';
import { LoginComponent } from './login/login.component';
import { RegisterUsuarioComponent } from './register-usuario/register-usuario.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrar-usuario', component: RegisterUsuarioComponent },
  { path: 'registrar-venda', component: RegistrarVendaComponent, canActivate: [AuthGuard] },
  { path: 'listar-vendas', component: ListarVendasComponent, canActivate: [AuthGuard] },
  { path: 'exibir-status-venda/:id', component: ExibirStatusVendaComponent }
];

export const appRoutingProviders = [provideRouter(routes)];
