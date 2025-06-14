import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PasswordChangeComponent } from "../password-change/password-change.component";
import { OrderHistoryComponent } from "../order-history/order-history.component";
import { AccountSettingsComponent } from "../account-settings/account-settings.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [PasswordChangeComponent, OrderHistoryComponent, AccountSettingsComponent, CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user: any;
  activeTab: string = 'settings';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.user = {
      username: this.authService.getUsername(),
      email: this.authService.getEmail(),
      photo: this.authService.getUserPhoto(),
      id: this.authService.getUserId(),
    };
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      this.userService.updateUser(formData).subscribe((response: any) => {
        this.user.photo = response.data.user.photo;
        localStorage.setItem('photo', response.data.user.photo);
      });
    }
  }
}
