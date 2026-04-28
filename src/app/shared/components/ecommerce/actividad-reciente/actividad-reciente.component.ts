import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from '../../ui/badge/badge.component';
import {
  ActividadService,
  RegistroSesion,
  RegistroReporte,
  SesionTipo,
  ReporteEstado,
} from '../../../services/actividad.service';

interface ItemFeed {
  tipo: 'sesion' | 'reporte';
  fecha: string;
  hora?: string;
  nombre: string;
  apartamento: string;
  avatar: string;
  texto: string;
  badge: string;
  color: 'success' | 'light' | 'warning' | 'info';
}

@Component({
  selector: 'app-actividad-reciente',
  imports: [CommonModule, RouterModule, BadgeComponent],
  templateUrl: './actividad-reciente.component.html',
})
export class ActividadRecienteComponent implements OnInit {
  items: ItemFeed[] = [];

  constructor(private actividadService: ActividadService) {}

  ngOnInit() {
    this.actividadService.sesiones$.subscribe(() => this.recalcular());
    this.actividadService.reportes$.subscribe(() => this.recalcular());
  }

  private recalcular() {
    const sesiones: ItemFeed[] = this.actividadService.sesiones$.value.map((s: RegistroSesion) => ({
      tipo: 'sesion' as const,
      fecha: s.fecha,
      hora: s.hora,
      nombre: s.propietario.nombre,
      apartamento: s.propietario.apartamento,
      avatar: s.propietario.avatar,
      texto: s.tipo,
      badge: s.tipo === 'Inicio de sesión' ? 'Login' : 'Logout',
      color: this.colorSesion(s.tipo),
    }));

    const reportes: ItemFeed[] = this.actividadService.reportes$.value.map((r: RegistroReporte) => ({
      tipo: 'reporte' as const,
      fecha: r.fecha,
      nombre: r.propietario.nombre,
      apartamento: r.propietario.apartamento,
      avatar: r.propietario.avatar,
      texto: `Reporte: ${r.titulo}`,
      badge: r.estado,
      color: this.colorReporte(r.estado),
    }));

    this.items = [...sesiones, ...reportes]
      .sort((a, b) => `${b.fecha} ${b.hora ?? ''}`.localeCompare(`${a.fecha} ${a.hora ?? ''}`))
      .slice(0, 8);
  }

  private colorSesion(tipo: SesionTipo): 'success' | 'light' {
    return tipo === 'Inicio de sesión' ? 'success' : 'light';
  }

  private colorReporte(estado: ReporteEstado): 'warning' | 'info' | 'success' {
    if (estado === 'Pendiente') return 'warning';
    if (estado === 'En revisión') return 'info';
    return 'success';
  }
}
