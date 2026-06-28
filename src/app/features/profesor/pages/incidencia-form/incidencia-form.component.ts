import { Component, inject, signal, computed, OnInit, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ProfesorApiService } from '@features/profesor/services/profesor-api.service';
import { SchoolClassResponse } from '@core/auth/models/school-class-response.model';

type AlumnoModel = {
  id: number;
  nombre: string;
  codigo: string;
  dni: string;
};

export type IncidenciaFormValue = {
  title: string;
  studentId: number;
  classId: number;
  description: string;
};

@Component({
  selector: 'app-incidencia-form',
  imports: [ReactiveFormsModule],
  templateUrl: './incidencia-form.component.html',
  styleUrl: './incidencia-form.component.css',
})
export class IncidenciaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profesorApiService = inject(ProfesorApiService);
  private readonly route = inject(ActivatedRoute);

  incidenciaId = input<number | null>(null);
  closed = output<void>();
  saved = output<IncidenciaFormValue>();

  form!: FormGroup;
  isEditMode = computed(() => this.incidenciaId() !== null);

  clases = signal<SchoolClassResponse[]>([]);
  alumnos = signal<AlumnoModel[]>([]);

  busquedaAlumno = signal<string>('');
  mostrarSugerencias = signal<boolean>(false);
  alumnoSeleccionado = signal<AlumnoModel | null>(null);

  alumnosFiltrados = computed(() => {
    const query = this.busquedaAlumno().toLowerCase().trim();
    if (query.length < 2) return this.alumnos(); // Show all students if query is short, since user wants combobox behavior
    return this.alumnos().filter(
      (a) =>
        a.nombre.toLowerCase().includes(query) ||
        a.codigo.toLowerCase().includes(query) ||
        a.dni.includes(query)
    );
  });

  caracteresCount = computed(() => {
    const desc = this.form?.get('description')?.value || '';
    return desc.length;
  });

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();

    // Watch class selection changes to load matching students
    this.form.get('classId')?.valueChanges.subscribe((classId) => {
      if (classId) {
        this.loadStudentsForClass(Number(classId));
      } else {
        this.alumnos.set([]);
        this.alumnoSeleccionado.set(null);
        this.form.patchValue({ studentId: null });
        this.busquedaAlumno.set('');
      }
    });

    // Check for query parameters to prepopulate the form
    this.route.queryParams.subscribe((params) => {
      if (params['classId']) {
        const classId = Number(params['classId']);
        this.form.patchValue({ classId });

        // After classes are loaded, it will load students. We need to select the student if studentDni is present.
        this.loadStudentsForClass(classId, () => {
          if (params['studentDni']) {
            const student = this.alumnos().find((a) => a.dni === params['studentDni']);
            if (student) {
              this.seleccionarAlumno(student);
            }
          }
        });
      }
    });
  }

  private initForm(): void {
    const hoy = new Date();
    const hoyFecha = hoy.toISOString().substring(0, 10);
    const hoyHora = hoy.toTimeString().substring(0, 5);

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      studentId: [null, Validators.required],
      classId: ['', Validators.required],
      incidentDate: [hoyFecha, Validators.required],
      incidentTime: [hoyHora, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  private loadClasses(): void {
    this.profesorApiService.getMyClasses().subscribe({
      next: (res) => {
        if (res.success) {
          this.clases.set(res.data);

          // If editing, load incident details after classes list is loaded
          const id = this.incidenciaId();
          if (id !== null) {
            this.cargarDatosEdicion(id);
          }
        }
      },
      error: (err) => console.error('Error loading teacher classes:', err),
    });
  }

  private loadStudentsForClass(classId: number, onLoaded?: () => void): void {
    this.profesorApiService.getClassStudents(classId).subscribe({
      next: (res) => {
        if (res.success) {
          const mapped = res.data.map((s) => ({
            id: s.id,
            nombre: `${s.firstName} ${s.lastName}`,
            codigo: s.studentCode,
            dni: s.dni,
          }));
          this.alumnos.set(mapped);
          if (onLoaded) {
            onLoaded();
          }
        }
      },
      error: (err) => console.error('Error loading class students:', err),
    });
  }

  private cargarDatosEdicion(id: number): void {
    this.profesorApiService.getIncidentById(id).subscribe({
      next: (res) => {
        if (res.success) {
          const incident = res.data;
          this.form.patchValue({
            title: incident.title,
            classId: incident.classId,
            description: incident.description,
          });

          this.loadStudentsForClass(incident.classId, () => {
            const student = this.alumnos().find((a) => a.id === incident.studentId);
            if (student) {
              this.seleccionarAlumno(student);
            }
          });
        }
      },
      error: (err) => console.error('Error loading incident details for edit:', err),
    });
  }

  onStudentSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busquedaAlumno.set(input.value);
    this.mostrarSugerencias.set(true);

    if (!input.value) {
      this.alumnoSeleccionado.set(null);
      this.form.patchValue({ studentId: null });
    }
  }

  seleccionarAlumno(alumno: AlumnoModel): void {
    this.alumnoSeleccionado.set(alumno);
    this.busquedaAlumno.set(alumno.nombre);
    this.mostrarSugerencias.set(false);
    this.form.patchValue({ studentId: alumno.id });
  }

  cancelar(): void {
    this.closed.emit();
  }

  closeFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancelar();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const payload: IncidenciaFormValue = {
      title: val.title,
      studentId: val.studentId,
      classId: Number(val.classId),
      description: val.description,
    };

    this.saved.emit(payload);
    this.closed.emit();
  }
}
