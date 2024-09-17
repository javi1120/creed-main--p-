import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesComponent } from './reportes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save input value and call generarpdf', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    const buttonElement = fixture.nativeElement.querySelector('button');
    const testValue = '61';

    inputElement.value = testValue;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    spyOn(component['reportesService'], 'generarpdf').and.callThrough();

    buttonElement.click();
    fixture.detectChanges();

    expect(component.savedValue).toBe(testValue);
    expect(component['reportesService'].generarpdf).toHaveBeenCalledWith(testValue);
  });
});