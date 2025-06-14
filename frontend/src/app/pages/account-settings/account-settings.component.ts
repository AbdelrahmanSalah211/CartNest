import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account-settings.component.html',
})
export class AccountSettingsComponent implements OnInit {
  @Input() user: any;

  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      username: [''],
      email: [''],
      gender: ['']
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue({
        username: this.user.username,
        email: this.user.email,
        gender: this.user.gender || ''
      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    for (const key in this.form.value) {
      formData.append(key, this.form.value[key]);
    }
    this.userService.updateUser(formData).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully!');
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email);
        if (res.data.user.photo) localStorage.setItem('photo', res.data.user.photo);
      },
      error: err => alert('Error: ' + err.error.message)
    });
  }
}
