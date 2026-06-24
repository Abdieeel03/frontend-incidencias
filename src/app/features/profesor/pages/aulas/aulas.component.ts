import { Component, signal } from '@angular/core';

type Aula = {
  id: number;
  nombre: string;
  materia: string;
  nivel: string;
  alumnosCount: number;
  criticasCount: number;
  pendientesCount: number;
};

@Component({
  selector: 'app-aulas',
  imports: [],
  templateUrl: './aulas.component.html',
  styleUrl: './aulas.component.css',
})
export class AulasComponent {
  aulas = signal<Aula[]>([
    {
      id: 1,
      nombre: '4to A',
      materia: 'TUTORÍA',
      nivel: 'Secundaria',
      alumnosCount: 32,
      criticasCount: 2,
      pendientesCount: 1
    },
    {
      id: 2,
      nombre: '5to B',
      materia: 'MATEMÁTICAS',
      nivel: 'Secundaria',
      alumnosCount: 28,
      criticasCount: 0,
      pendientesCount: 0
    },
    {
      id: 3,
      nombre: '6to A',
      materia: 'CIENCIAS',
      nivel: 'Primaria',
      alumnosCount: 25,
      criticasCount: 0,
      pendientesCount: 3
    }
  ]);
}
