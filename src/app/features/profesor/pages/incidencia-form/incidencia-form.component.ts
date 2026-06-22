import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProfesorHeaderComponent } from '../../components/profesor-header/profesor-header.component';

interface AlumnoMock {
  id: number;
  nombre: string;
  codigo: string;
  dni: string;
}

interface ClaseMock {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-incidencia-form',
  imports: [ReactiveFormsModule, RouterLink, ProfesorHeaderComponent],
  templateUrl: './incidencia-form.component.html',
  styleUrl: './incidencia-form.component.css'
})
export class IncidenciaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal<boolean>(false);
  incidenciaId = signal<number | null>(null);

  clases = signal<ClaseMock[]>([
    { id: 1, nombre: '4to A - Matemáticas' },
    { id: 2, nombre: '4to A - Tutoría' },
    { id: 3, nombre: '5to B - Matemáticas' },
    { id: 4, nombre: '6to A - Ciencias' }
  ]);

  alumnos = signal<AlumnoMock[]>([
    { id: 1, nombre: 'Alejandro Ramírez García', codigo: 'EST-001', dni: '72345671' },
    { id: 2, nombre: 'Valentina Martínez López', codigo: 'EST-002', dni: '72345672' },
    { id: 3, nombre: 'Sebastián Fernández Quispe', codigo: 'EST-003', dni: '72345673' },
    { id: 4, nombre: 'Camila Espinoza Torres', codigo: 'EST-004', dni: '72345674' },
    { id: 5, nombre: 'Mateo Gutiérrez Flores', codigo: 'EST-005', dni: '72345675' }
  ]);

  busquedaAlumno = signal<string>('');
  mostrarSugerencias = signal<boolean>(false);
  alumnoSeleccionado = signal<AlumnoMock | null>(null);

  alumnosFiltrados = computed(() => {
    const query = this.busquedaAlumno().toLowerCase().trim();
    if (query.length < 2) return [];
    return this.alumnos().filter(a => 
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
    this.checkEditMode();
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
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.isEditMode.set(true);
      this.incidenciaId.set(id);
      this.cargarDatosEdicion(id);
    }
  }

  private cargarDatosEdicion(id: number): void {
    const alumnoMock = this.alumnos()[0];
    this.seleccionarAlumno(alumnoMock);

    this.form.patchValue({
      title: 'Interrupción reiterada en clase',
      classId: 1,
      incidentDate: '2026-06-22',
      incidentTime: '10:30',
      description: 'El estudiante interrumpió de manera reiterada la clase de matemáticas levantándose de su asiento sin autorización.'
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

  seleccionarAlumno(alumno: AlumnoMock): void {
    this.alumnoSeleccionado.set(alumno);
    this.busquedaAlumno.set(alumno.nombre);
    this.mostrarSugerencias.set(false);
    this.form.patchValue({ studentId: alumno.id });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    alert(this.isEditMode() ? '¡Incidencia actualizada correctamente!' : '¡Incidencia registrada con éxito!');
    this.router.navigate(['/profesor/incidencias']);
  }
}