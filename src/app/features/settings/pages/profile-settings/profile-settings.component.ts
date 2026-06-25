import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type MockUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'COORDINADOR' | 'PROFESOR' | 'PADRE';
};

@Component({
  selector: 'app-profile-settings',
  imports: [FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
})
export class ProfileSettingsComponent {
  protected readonly mockUser: MockUser = {
    id: 1,
    name: 'María González López',
    username: 'MGONZALEZ',
    email: 'maria.gonzalez@colegio.edu',
    role: 'COORDINADOR',
  };

  protected readonly oldPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly isSavingPassword = signal(false);
  protected readonly passwordErrors = signal<Record<string, string>>({});
  protected readonly passwordSuccess = signal(false);

  protected readonly profileImage = signal<string | null>(null);

  protected readonly avatarInitials = computed(() => {
    return this.mockUser.name.charAt(0).toUpperCase();
  });

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

    setTimeout(() => {
      this.oldPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
      this.passwordErrors.set({});
      this.passwordSuccess.set(true);
      this.isSavingPassword.set(false);

      setTimeout(() => this.passwordSuccess.set(false), 3000);
    }, 1000);
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
      this.profileImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  protected triggerImageUpload(): void {
    const input = document.getElementById('profile-image-input') as HTMLInputElement;
    input?.click();
  }
}
