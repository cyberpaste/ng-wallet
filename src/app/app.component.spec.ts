import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let dom: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],

    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      appComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      dom = fixture.debugElement.nativeElement;
    });
  }));

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  /*it(`should have title 'Wallet'`, () => {
    let x  = TestBed.createComponent(AppComponent).nativeElement
    fixture.whenRenderingDone().then(() => {
      expect(fixture.nativeElement.outerHTML).toContain('Wallet App');
    });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('html').textContent).toContain('Welcome to angular-unit-test!');

    expect(TestBed.createComponent(AppComponent).nativeElement.).toContain('Wallet App');
  });*/

});
