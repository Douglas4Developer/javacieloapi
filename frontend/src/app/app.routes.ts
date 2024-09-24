import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RegistrarVendaComponent } from './registrar-venda/registrar-venda.component';
import { ListarVendasComponent } from './listar-vendas/listar-vendas.component';
import { ExibirStatusVendaComponent } from './exibir-status-venda/exibir-status-venda.component';
import { LoginComponent } from './login/login.component';
import { RegisterUsuarioComponent } from './register-usuario/register-usuario.component';
import { AuthGuard } from './services/auth.guard';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'registrar-usuario', component: RegisterUsuarioComponent },
  { path: 'registrar-venda', component: RegistrarVendaComponent, canActivate: [AuthGuard] },
  { path: 'listar-vendas', component: ListarVendasComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

export const appRoutingProviders = [provideRouter(routes)];
