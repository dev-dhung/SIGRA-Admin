import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import {
  ActividadService,
  Propietario,
  RegistroPago,
  RegistroReporte,
  RegistroSesion,
  ReporteEstado,
  SesionTipo,
  SolvenciaEstado,
} from '../../shared/services/actividad.service';
import { ExportacionService, ExportColumn } from '../../shared/services/exportacion.service';

type Tab = 'sesiones' | 'reportes' | 'pagos';

@Component({
  selector: 'app-actividad',
  imports: [
    CommonModule,
    FormsModule,
    ComponentCardComponent,
    PageBreadcrumbComponent,
    BadgeComponent,
  ],
  templateUrl: './actividad.component.html',
})
export class ActividadComponent implements OnInit {
  tabActiva: Tab = 'sesiones';
  filtroBusqueda = '';

  sesiones: RegistroSesion[] = [];
  reportes: RegistroReporte[] = [];
  pagos: RegistroPago[] = [];

  propietarios: Propietario[] = [];

  // Modal: registrar sesión
  modalSesionAbierto = false;
  formSesion = {
    propietarioKey: '',
    tipo: 'Inicio de sesión' as SesionTipo,
    dispositivo: 'Web · Admin SIGRA',
  };

  // Modal: registrar reporte
  modalReporteAbierto = false;
  formReporte = {
    propietarioKey: '',
    titulo: '',
    categoria: 'Mantenimiento',
  };
  categorias = ['Mantenimiento', 'Convivencia', 'Áreas comunes', 'Seguridad', 'Otros'];

  resumen = {
    sesionesHoy: 0,
    reportesAbiertos: 0,
    solventes: 0,
    porVencer: 0,
    vencidos: 0,
  };

  constructor(
    private actividadService: ActividadService,
    private exportService: ExportacionService,
  ) {}

  ngOnInit() {
    this.actividadService.sesiones$.subscribe(s => {
      this.sesiones = s;
      this.calcularResumen();
    });
    this.actividadService.reportes$.subscribe(r => {
      this.reportes = r;
      this.calcularResumen();
    });
    this.actividadService.pagos$.subscribe(p => {
      this.pagos = p;
      this.calcularResumen();
    });
    this.propietarios = this.actividadService.propietarios;
    if (this.propietarios.length > 0) {
      this.formSesion.propietarioKey = this.keyDe(this.propietarios[0]);
      this.formReporte.propietarioKey = this.keyDe(this.propietarios[0]);
    }
  }

  private calcularResumen() {
    const hoy = new Date().toISOString().slice(0, 10);
    this.resumen = {
      sesionesHoy: this.sesiones.filter(s => s.fecha === hoy).length,
      reportesAbiertos: this.reportes.filter(r => r.estado !== 'Resuelto').length,
      solventes: this.pagos.filter(p => p.estado === 'Solvente').length,
      porVencer: this.pagos.filter(p => p.estado === 'Por vencer').length,
      vencidos: this.pagos.filter(p => p.estado === 'Vencido').length,
    };
  }

  cambiarTab(tab: Tab) {
    this.tabActiva = tab;
    this.filtroBusqueda = '';
  }

  get sesionesFiltradas(): RegistroSesion[] {
    const q = this.filtroBusqueda.toLowerCase().trim();
    if (!q) return this.sesiones;
    return this.sesiones.filter(s =>
      s.propietario.nombre.toLowerCase().includes(q) ||
      s.propietario.apartamento.toLowerCase().includes(q) ||
      s.tipo.toLowerCase().includes(q)
    );
  }

  get reportesFiltrados(): RegistroReporte[] {
    const q = this.filtroBusqueda.toLowerCase().trim();
    if (!q) return this.reportes;
    return this.reportes.filter(r =>
      r.propietario.nombre.toLowerCase().includes(q) ||
      r.propietario.apartamento.toLowerCase().includes(q) ||
      r.titulo.toLowerCase().includes(q) ||
      r.categoria.toLowerCase().includes(q)
    );
  }

  get pagosFiltrados(): RegistroPago[] {
    const q = this.filtroBusqueda.toLowerCase().trim();
    if (!q) return this.pagos;
    return this.pagos.filter(p =>
      p.propietario.nombre.toLowerCase().includes(q) ||
      p.propietario.apartamento.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q)
    );
  }

  colorSesion(tipo: SesionTipo): 'success' | 'light' {
    return tipo === 'Inicio de sesión' ? 'success' : 'light';
  }

  colorReporte(estado: ReporteEstado): 'warning' | 'info' | 'success' {
    if (estado === 'Pendiente') return 'warning';
    if (estado === 'En revisión') return 'info';
    return 'success';
  }

  colorPago(estado: SolvenciaEstado): 'success' | 'warning' | 'error' {
    if (estado === 'Solvente') return 'success';
    if (estado === 'Por vencer') return 'warning';
    return 'error';
  }

  textoDiasRestantes(dias: number): string {
    if (dias < 0) return `Vencido hace ${Math.abs(dias)} días`;
    if (dias === 0) return 'Vence hoy';
    if (dias === 1) return 'Vence mañana';
    return `Vence en ${dias} días`;
  }

  // Modales
  abrirModalSesion() { this.modalSesionAbierto = true; }
  cerrarModalSesion() { this.modalSesionAbierto = false; }

  abrirModalReporte() { this.modalReporteAbierto = true; }
  cerrarModalReporte() {
    this.modalReporteAbierto = false;
    this.formReporte.titulo = '';
  }

  guardarSesion() {
    const propietario = this.propietarioPorKey(this.formSesion.propietarioKey);
    if (!propietario) return;
    this.actividadService.registrarSesion(propietario, this.formSesion.tipo, this.formSesion.dispositivo);
    this.cerrarModalSesion();
  }

  guardarReporte() {
    const propietario = this.propietarioPorKey(this.formReporte.propietarioKey);
    if (!propietario || !this.formReporte.titulo.trim()) return;
    this.actividadService.registrarReporte(propietario, this.formReporte.titulo.trim(), this.formReporte.categoria);
    this.cerrarModalReporte();
  }

  cambiarEstadoReporte(id: number, estado: ReporteEstado) {
    this.actividadService.cambiarEstadoReporte(id, estado);
  }

  registrarPagoRecibido(id: number) {
    this.actividadService.registrarPagoRecibido(id);
  }

  resetearDatos() {
    if (confirm('¿Restablecer todos los datos a los valores iniciales?')) {
      this.actividadService.resetData();
    }
  }

  keyDe(p: Propietario): string {
    return `${p.nombre}|${p.apartamento}`;
  }

  private propietarioPorKey(key: string): Propietario | undefined {
    return this.propietarios.find(p => this.keyDe(p) === key);
  }

  // Exportación
  exportarExcel() {
    if (this.tabActiva === 'sesiones') {
      const cols: ExportColumn<RegistroSesion>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Tipo', field: r => r.tipo },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Hora', field: r => r.hora },
        { header: 'Dispositivo', field: r => r.dispositivo },
        { header: 'IP', field: r => r.ip },
      ];
      this.exportService.exportarExcel('actividad-sesiones', 'Sesiones', cols, this.sesionesFiltradas);
    } else if (this.tabActiva === 'reportes') {
      const cols: ExportColumn<RegistroReporte>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Reporte', field: r => r.titulo },
        { header: 'Categoría', field: r => r.categoria },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Estado', field: r => r.estado },
      ];
      this.exportService.exportarExcel('actividad-reportes', 'Reportes', cols, this.reportesFiltrados);
    } else {
      const cols: ExportColumn<RegistroPago>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Estado', field: r => r.estado },
        { header: 'Último pago', field: r => r.ultimoPago },
        { header: 'Próximo vencimiento', field: r => r.proximoVencimiento },
        { header: 'Días restantes', field: r => r.diasRestantes },
        { header: 'Monto', field: r => r.monto },
      ];
      this.exportService.exportarExcel('actividad-solvencia', 'Solvencia', cols, this.pagosFiltrados);
    }
  }

  exportarCSV() {
    if (this.tabActiva === 'sesiones') {
      const cols: ExportColumn<RegistroSesion>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Tipo', field: r => r.tipo },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Hora', field: r => r.hora },
        { header: 'Dispositivo', field: r => r.dispositivo },
        { header: 'IP', field: r => r.ip },
      ];
      this.exportService.exportarCSV('actividad-sesiones', cols, this.sesionesFiltradas);
    } else if (this.tabActiva === 'reportes') {
      const cols: ExportColumn<RegistroReporte>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Reporte', field: r => r.titulo },
        { header: 'Categoría', field: r => r.categoria },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Estado', field: r => r.estado },
      ];
      this.exportService.exportarCSV('actividad-reportes', cols, this.reportesFiltrados);
    } else {
      const cols: ExportColumn<RegistroPago>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Estado', field: r => r.estado },
        { header: 'Último pago', field: r => r.ultimoPago },
        { header: 'Próximo vencimiento', field: r => r.proximoVencimiento },
        { header: 'Días restantes', field: r => r.diasRestantes },
        { header: 'Monto', field: r => r.monto },
      ];
      this.exportService.exportarCSV('actividad-solvencia', cols, this.pagosFiltrados);
    }
  }

  exportarPDF() {
    if (this.tabActiva === 'sesiones') {
      const cols: ExportColumn<RegistroSesion>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Tipo', field: r => r.tipo },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Hora', field: r => r.hora },
        { header: 'Dispositivo', field: r => r.dispositivo },
        { header: 'IP', field: r => r.ip },
      ];
      this.exportService.exportarPDF('actividad-sesiones', 'Registro de inicio / cierre de sesión', cols, this.sesionesFiltradas);
    } else if (this.tabActiva === 'reportes') {
      const cols: ExportColumn<RegistroReporte>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Reporte', field: r => r.titulo },
        { header: 'Categoría', field: r => r.categoria },
        { header: 'Fecha', field: r => r.fecha },
        { header: 'Estado', field: r => r.estado },
      ];
      this.exportService.exportarPDF('actividad-reportes', 'Reportes de propietarios', cols, this.reportesFiltrados);
    } else {
      const cols: ExportColumn<RegistroPago>[] = [
        { header: 'Propietario', field: r => r.propietario.nombre },
        { header: 'Apartamento', field: r => r.propietario.apartamento },
        { header: 'Estado', field: r => r.estado },
        { header: 'Último pago', field: r => r.ultimoPago },
        { header: 'Próximo vencimiento', field: r => r.proximoVencimiento },
        { header: 'Días restantes', field: r => String(r.diasRestantes) },
        { header: 'Monto', field: r => r.monto },
      ];
      this.exportService.exportarPDF('actividad-solvencia', 'Solvencia de propietarios', cols, this.pagosFiltrados);
    }
  }
}
