import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@core/auth/services/auth.service';
import { SettingsApiService } from '@features/settings/services/settings-api.service';

@Component({
  selector: 'app-profile-settings',
  imports: [FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
})
export class ProfileSettingsComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly settingsApiService = inject(SettingsApiService);

  protected readonly oldPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly isSavingPassword = signal(false);
  protected readonly passwordErrors = signal<Record<string, string>>({});
  protected readonly passwordSuccess = signal(false);

  protected readonly profileImage = signal<string | null>(null);

  protected readonly user = this.authService.user;

  protected readonly avatarInitials = computed(() => {
    const name = this.user()?.name ?? '';
    return name.charAt(0).toUpperCase();
  });

  ngOnInit(): void {
    const imageUrl = this.user()?.imageUrl;
    if (imageUrl) {
      this.profileImage.set(imageUrl);
    }
  }

  protected validatePasswordForm(): boolean {
    const errors: Record<string, string> = {};
    const oldPwd = this.oldPassword();
    const newPwd = this.newPassword();
    const confirmPwd = this.confirmPassword();

    if (!oldPwd) {
      errors['oldPassword'] = 'La contraseña actual es obligatoria';
    }

    if (!newPwd) {
      errors['newPassword'] = 'La nueva contraseña es obligatoria';
    } else if (newPwd.length < 8) {
      errors['newPassword'] = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (newPwd !== confirmPwd) {
      errors['confirmPassword'] = 'Las contraseñas nuevas no coinciden';
    }

    this.passwordErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  protected handlePasswordChange(event: Event): void {
    event.preventDefault();
    if (!this.validatePasswordForm()) return;

    this.isSavingPassword.set(true);
    this.passwordSuccess.set(false);

    this.settingsApiService.changePassword({
      currentPassword: this.oldPassword(),
      newPassword: this.newPassword(),
      confirmPassword: this.confirmPassword()
    }).subscribe({
      next: (res) => {
        this.isSavingPassword.set(false);
        if (res.success) {
          this.oldPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
          this.passwordErrors.set({});
          this.passwordSuccess.set(true);
          setTimeout(() => this.passwordSuccess.set(false), 3000);
        } else {
          this.passwordErrors.set({ form: res.message || 'Error al cambiar la contraseña.' });
        }
      },
      error: (err) => {
        this.isSavingPassword.set(false);
        const errMsg = err.error?.message || 'Error al cambiar la contraseña. Verifique sus datos.';
        this.passwordErrors.set({ form: errMsg });
      }
    });
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      
      // Call API to persist own profile image
      this.settingsApiService.updateProfile({
        email: this.user()?.email || '',
        imageUrl: dataUrl
      }).subscribe({
        next: (res) => {
          if (res.success) {
            this.profileImage.set(res.data.imageUrl || dataUrl);
            
            // Update auth session image so sidebar updates immediately
            const session = this.authService.session();
            if (session) {
              this.authService.setSession({
                ...session,
                user: {
                  ...session.user,
                  imageUrl: res.data.imageUrl || dataUrl
                }
              });
            }
          }
        },
        error: (err) => {
          console.error('Error updating profile picture:', err);
          alert(err.error?.message || 'Error al guardar la imagen de perfil.');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  protected triggerImageUpload(): void {
    const input = document.getElementById('profile-image-input') as HTMLInputElement;
    input?.click();
  }
}
