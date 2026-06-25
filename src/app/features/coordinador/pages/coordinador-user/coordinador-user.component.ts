import { Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';

export type User = {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: 'PADRE' | 'PROFESOR';
  isDeleted: boolean;
};

@Component({
  selector: 'app-coordinador-user',
  imports: [ReactiveFormsModule],
  templateUrl: './coordinador-user.component.html',
  styleUrl: './coordinador-user.component.css',
})
export class CoordinadorUserComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  // Estados
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);

  // Modal
  protected readonly isUserModalOpen = signal(false);

  // Filtros
  protected readonly search = signal('');
  protected readonly showDeleted = signal(false);

  // Datos de prueba
  protected readonly users = signal<User[]>([
    {
      id: 1,
      username: 'P70000001',
      email: 'padre01@incidencias.local',
      name: 'Padre 01',
      dni: '70000001',
      role: 'PADRE',
      isDeleted: false
    },
    {
      id: 2,
      username: 'T70000002',
      email: 'profesor01@incidencias.local',
      name: 'Profesor 01',
      dni: '70000002',
      role: 'PROFESOR',
      isDeleted: false
    }
  ]);

  // Formulario
  protected readonly userForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['PADRE' as 'PADRE' | 'PROFESOR']
  });

  // Lista filtrada
  protected readonly filteredUsers = computed(() => {
    return this.users().filter(
      user => user.isDeleted === this.showDeleted()
    );
  });

  // Abrir modal
  protected openCreateModal(): void {
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'PADRE'
    });
    this.isUserModalOpen.set(true);
  }

  protected toggleShowDeleted(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showDeleted.set(target.checked);
  }

  // Guardar usuario
  protected saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const form = this.userForm.getRawValue();
    const nextId = Math.max(...this.users().map(u => u.id), 0) + 1;
    const username = (form.role === 'PADRE' ? 'P' : 'T') + form.dni;
    const newUser: User = {
      id: nextId,
      username,
      email: form.email,
      name: form.fullName,
      dni: form.dni,
      role: form.role,
      isDeleted: false
    };

    this.users.update(users => [
      newUser,
      ...users
    ]);
    this.isUserModalOpen.set(false);
  }

  // Eliminar
  protected deleteUser(user: User): void {
    this.users.update(users =>
      users.map(u =>
        u.id === user.id
          ? { ...u, isDeleted: true }
          : u
      )
    );
  }

  // Restaurar
  protected restoreUser(user: User): void {
    this.users.update(users =>
      users.map(u =>
        u.id === user.id
          ? { ...u, isDeleted: false }
          : u
      )
    );
  }
}