import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from '../../services/login.service';
import * as THREE from 'three';
import BIRDS from 'vanta/src/vanta.birds';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../utils/global';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    FloatLabelModule,
    RippleModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  loginForm!: FormGroup;
  @ViewChild('vantaRef', { static: true }) vantaRef!: ElementRef;
  vantaEffect: any;

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });

    this.service.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);

      // log token
      if (msg.message == 'success') {
        if (msg.token) {
          localStorage.setItem('auth_token', msg.token);
          this.router.navigate(['/monthly-invoice']);
        }
        return true;
      }
      return true;
    });
  }

  ngAfterViewInit() {
    this.vantaEffect = BIRDS({
      el: this.vantaRef.nativeElement,
      THREE,
      mouseControls: true,
      touchControls: true,
      minHeight: 300.00,
      minWidth: 300.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundAlpha: 0.0,
      color1: 0x5d5df2,
      color2: 0xb641e8,
      colorMode: "lerpGradient"
    });
  }

  ngOnDestroy(): void {
    this.service.unregisterPageHandler();
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
      this.service.login(this.loginForm.value);
    }
    else {
      console.log(this.loginForm.errors)
    }
  }
}
