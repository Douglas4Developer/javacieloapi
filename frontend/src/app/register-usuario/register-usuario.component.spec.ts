import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUsuarioComponent } from './register-usuario.component';

describe('RegisterUsuarioComponent', () => {
  let component: RegisterUsuarioComponent;
  let fixture: ComponentFixture<RegisterUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
