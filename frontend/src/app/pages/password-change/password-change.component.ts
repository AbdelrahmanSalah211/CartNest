import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-password-change',
  imports: [ReactiveFormsModule],
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    this.userService.updatePassword(this.form.value).subscribe({
      next: () => alert('Password updated successfully!'),
      error: err => alert('Error: ' + err.error.message)
    });
  }
}
