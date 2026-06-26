import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';

import { CoordinadorApiService } from '../../services/coordinador-api.service';
import { UserResponse } from '@core/auth/models/user-response.model';
import { UserRole, USER_ROLES } from '@core/auth/models/user-role.model';

@Component({
  selector: 'app-coordinador-user',
  imports: [ReactiveFormsModule],
  templateUrl: './coordinador-user.component.html',
  styleUrl: './coordinador-user.component.css',
})
export class CoordinadorUserComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly coordinadorApiService = inject(CoordinadorApiService);

  // Estados
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);

  // Modal
  protected readonly isUserModalOpen = signal(false);
  protected readonly idParaEditar = signal<number | null>(null);

  // Filtros
  protected readonly search = signal('');
  protected readonly roleFilter = signal<string>('');
  protected readonly showDeleted = signal(false);

  // Datos reales desde la API
  protected readonly users = signal<UserResponse[]>([]);

  // Formulario
  protected readonly userForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['PADRE' as UserRole]
  });

  protected readonly isEditMode = computed(() => this.idParaEditar() !== null);

  // Lista filtrada
  protected readonly filteredUsers = computed(() => {
    const list = this.users();
    const query = this.search().toLowerCase().trim();
    const role = this.roleFilter();

    return list.filter(user => {
      const matchesSearch = !query || 
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.dni.includes(query);

      const matchesRole = !role || user.role === role;

      return matchesSearch && matchesRole;
    });
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.isLoading.set(true);
    const request$ = this.showDeleted()
      ? this.coordinadorApiService.getDeletedUsers()
      : this.coordinadorApiService.getUsers();

    request$.subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          // Filtrar para mostrar solo PROFESOR y PADRE creados (por seguridad)
          const filtered = res.data.filter(u => u.role !== USER_ROLES.COORDINADOR);
          this.users.set(filtered);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading users:', err);
      }
    });
  }

  // Abrir modal creación
  protected openCreateModal(): void {
    this.idParaEditar.set(null);
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'PADRE'
    });
    
    // Enable fields for creation
    this.userForm.controls.fullName.enable();
    this.userForm.controls.email.enable();
    this.userForm.controls.password.enable();
    
    this.isUserModalOpen.set(true);
  }

  // Abrir modal edición
  protected openEditModal(user: UserResponse): void {
    this.idParaEditar.set(user.id);
    this.userForm.reset();
    
    this.userForm.patchValue({
      fullName: user.name,
      email: user.email,
      dni: user.dni,
      role: user.role,
      password: 'dummy-password' // Dummy value since password is not edited
    });

    // Disable uneditable fields for coordinator editing
    this.userForm.controls.fullName.disable();
    this.userForm.controls.email.disable();
    this.userForm.controls.password.disable();

    this.isUserModalOpen.set(true);
  }

  protected toggleShowDeleted(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showDeleted.set(target.checked);
    this.loadUsers();
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  protected onRoleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.roleFilter.set(target.value);
  }

  // Guardar usuario
  protected saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const form = this.userForm.getRawValue();
    const id = this.idParaEditar();

    if (id !== null) {
      // Editar (solo DNI y rol)
      this.coordinadorApiService.updateUserDniRole(id, {
        dni: form.dni,
        role: form.role
      }).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success) {
            this.isUserModalOpen.set(false);
            this.loadUsers();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err.error?.message || 'Error al actualizar el usuario.');
        }
      });
    } else {
      // Crear
      this.coordinadorApiService.createUser({
        name: form.fullName,
        email: form.email,
        dni: form.dni,
        password: form.password,
        role: form.role
      }).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success) {
            this.isUserModalOpen.set(false);
            this.loadUsers();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err.error?.message || 'Error al crear el usuario.');
        }
      });
    }
  }

  // Eliminar
  protected deleteUser(user: UserResponse): void {
    if (confirm(`¿Está seguro de que desea eliminar al usuario ${user.name}?`)) {
      this.coordinadorApiService.deleteUser(user.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadUsers();
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert(err.error?.message || 'Error al eliminar el usuario.');
        }
      });
    }
  }

  // Restaurar
  protected restoreUser(user: UserResponse): void {
    this.coordinadorApiService.restoreUser(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadUsers();
        }
      },
      error: (err) => {
        console.error('Error restoring user:', err);
        alert(err.error?.message || 'Error al restaurar el usuario.');
      }
    });
  }
}