import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirStatusVendaComponent } from './exibir-status-venda.component';

describe('ExibirStatusVendaComponent', () => {
  let component: ExibirStatusVendaComponent;
  let fixture: ComponentFixture<ExibirStatusVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibirStatusVendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExibirStatusVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
