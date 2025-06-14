import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isRegister = false;
  errMsg = '';
  passwordFocus = false;
  matchFocus = false;
  emailFocus = false;
  usernameFocus = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)]],
      matchPassword: [''],
      gender: [''],
      photo: [null]
    });
  }

  ngOnInit(): void {
    const mode = this.route.snapshot.data['mode'];
    this.isRegister = mode === 'register';
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.form.reset();
    this.selectedFile = null;
    this.errMsg = '';
    const newRoute = this.isRegister ? '/register' : '/login';
    this.router.navigate([newRoute]);
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onSubmit() {
  const { username, email, password, matchPassword, gender } = this.form.value;

  if (this.isRegister) {
    if (password !== matchPassword) {
      this.errMsg = 'Passwords do not match';
      return;
    }

    const registerData: any = {
      username,
      email,
      password,
      gender,
      photo: this.form.get('photo')?.value
    };

    this.authService.register(registerData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.errMsg = err.error.message || 'Registration failed'
    });
  } else {
    const loginData = { email, password };
    this.authService.login(loginData).subscribe({
      next: () => {},
      error: err => this.errMsg = err.error.message || 'Login failed'
    });
  }
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.form.patchValue({ photo: file });
  }
}


  get f() {
    return this.form.controls;
  }
}
