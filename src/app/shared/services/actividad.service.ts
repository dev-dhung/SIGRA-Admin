import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SesionTipo = 'Inicio de sesión' | 'Cierre de sesión';
export type ReporteEstado = 'Pendiente' | 'En revisión' | 'Resuelto';
export type SolvenciaEstado = 'Solvente' | 'Por vencer' | 'Vencido';

export interface Propietario {
  nombre: string;
  apartamento: string;
  avatar: string;
}

export interface RegistroSesion {
  id: number;
  propietario: Propietario;
  tipo: SesionTipo;
  fecha: string;
  hora: string;
  dispositivo: string;
  ip: string;
}

export interface RegistroReporte {
  id: number;
  propietario: Propietario;
  titulo: string;
  categoria: string;
  fecha: string;
  estado: ReporteEstado;
}

export interface RegistroPago {
  id: number;
  propietario: Propietario;
  estado: SolvenciaEstado;
  ultimoPago: string;
  proximoVencimiento: string;
  diasRestantes: number;
  monto: string;
}

const STORAGE_KEY = 'sigra:actividad:v2';

interface ActividadState {
  sesiones: RegistroSesion[];
  reportes: RegistroReporte[];
  pagos: RegistroPago[];
}

const PROPIETARIOS_DEMO: Propietario[] = [
  { nombre: 'María González', apartamento: 'Torre A - 5B', avatar: '/images/user/user-17.jpg' },
  { nombre: 'Carlos Rivas', apartamento: 'Torre B - 12A', avatar: '/images/user/user-18.jpg' },
  { nombre: 'Ana Pérez', apartamento: 'Torre A - 3C', avatar: '/images/user/user-19.jpg' },
  { nombre: 'Luis Hernández', apartamento: 'Torre C - 8D', avatar: '/images/user/user-20.jpg' },
  { nombre: 'Sofía Martínez', apartamento: 'Torre B - 2A', avatar: '/images/user/user-21.jpg' },
  { nombre: 'Jorge Díaz', apartamento: 'Torre A - 9B', avatar: '/images/user/user-22.jpg' },
  { nombre: 'Patricia Salazar', apartamento: 'Torre C - 4A', avatar: '/images/user/user-23.jpg' },
  { nombre: 'Ricardo Mendoza', apartamento: 'Torre B - 7C', avatar: '/images/user/user-24.jpg' },
  { nombre: 'Valentina Romero', apartamento: 'Torre A - 11D', avatar: '/images/user/user-25.jpg' },
  { nombre: 'Miguel Castillo', apartamento: 'Torre C - 6B', avatar: '/images/user/user-26.jpg' },
  { nombre: 'Daniela Suárez', apartamento: 'Torre B - 4D', avatar: '/images/user/user-27.jpg' },
  { nombre: 'Andrés Bermúdez', apartamento: 'Torre A - 7A', avatar: '/images/user/user-28.jpg' },
];

function seed(): ActividadState {
  return {
    sesiones: [
      { id: 1, propietario: PROPIETARIOS_DEMO[0], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '11:14', dispositivo: 'Android · App SIGRA', ip: '190.202.18.45' },
      { id: 2, propietario: PROPIETARIOS_DEMO[7], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '10:48', dispositivo: 'iOS · App SIGRA', ip: '186.94.66.31' },
      { id: 3, propietario: PROPIETARIOS_DEMO[2], tipo: 'Cierre de sesión', fecha: '2026-04-28', hora: '10:32', dispositivo: 'Android · Chrome', ip: '186.94.211.7' },
      { id: 4, propietario: PROPIETARIOS_DEMO[6], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '10:05', dispositivo: 'Web · Chrome', ip: '190.78.45.18' },
      { id: 5, propietario: PROPIETARIOS_DEMO[1], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '09:51', dispositivo: 'iOS · Safari', ip: '190.202.45.112' },
      { id: 6, propietario: PROPIETARIOS_DEMO[3], tipo: 'Cierre de sesión', fecha: '2026-04-28', hora: '09:23', dispositivo: 'iOS · App SIGRA', ip: '190.202.99.21' },
      { id: 7, propietario: PROPIETARIOS_DEMO[8], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '08:42', dispositivo: 'Android · App SIGRA', ip: '186.88.10.41' },
      { id: 8, propietario: PROPIETARIOS_DEMO[5], tipo: 'Inicio de sesión', fecha: '2026-04-28', hora: '08:15', dispositivo: 'Web · Edge', ip: '190.202.33.77' },
      { id: 9, propietario: PROPIETARIOS_DEMO[10], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '23:08', dispositivo: 'Android · App SIGRA', ip: '186.88.55.91' },
      { id: 10, propietario: PROPIETARIOS_DEMO[4], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '22:41', dispositivo: 'iOS · App SIGRA', ip: '186.88.140.55' },
      { id: 11, propietario: PROPIETARIOS_DEMO[9], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '21:30', dispositivo: 'Android · App SIGRA', ip: '190.78.122.65' },
      { id: 12, propietario: PROPIETARIOS_DEMO[11], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '20:55', dispositivo: 'Android · Chrome', ip: '190.202.71.40' },
      { id: 13, propietario: PROPIETARIOS_DEMO[0], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '20:18', dispositivo: 'Android · App SIGRA', ip: '190.202.18.45' },
      { id: 14, propietario: PROPIETARIOS_DEMO[7], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '19:42', dispositivo: 'iOS · App SIGRA', ip: '186.94.66.31' },
      { id: 15, propietario: PROPIETARIOS_DEMO[6], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '18:30', dispositivo: 'Web · Chrome', ip: '190.78.45.18' },
      { id: 16, propietario: PROPIETARIOS_DEMO[2], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '17:55', dispositivo: 'Android · Chrome', ip: '186.94.211.7' },
      { id: 17, propietario: PROPIETARIOS_DEMO[8], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '17:14', dispositivo: 'Android · App SIGRA', ip: '186.88.10.41' },
      { id: 18, propietario: PROPIETARIOS_DEMO[3], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '16:42', dispositivo: 'iOS · Safari', ip: '190.202.99.21' },
      { id: 19, propietario: PROPIETARIOS_DEMO[1], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '15:30', dispositivo: 'iOS · App SIGRA', ip: '190.202.45.112' },
      { id: 20, propietario: PROPIETARIOS_DEMO[10], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '14:05', dispositivo: 'Android · Chrome', ip: '186.88.55.91' },
      { id: 21, propietario: PROPIETARIOS_DEMO[5], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '13:21', dispositivo: 'Web · Edge', ip: '190.202.33.77' },
      { id: 22, propietario: PROPIETARIOS_DEMO[11], tipo: 'Inicio de sesión', fecha: '2026-04-27', hora: '12:18', dispositivo: 'Android · App SIGRA', ip: '190.202.71.40' },
      { id: 23, propietario: PROPIETARIOS_DEMO[9], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '11:42', dispositivo: 'Android · App SIGRA', ip: '190.78.122.65' },
      { id: 24, propietario: PROPIETARIOS_DEMO[4], tipo: 'Cierre de sesión', fecha: '2026-04-27', hora: '10:18', dispositivo: 'iOS · App SIGRA', ip: '186.88.140.55' },
      { id: 25, propietario: PROPIETARIOS_DEMO[0], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '21:42', dispositivo: 'Android · App SIGRA', ip: '190.202.18.45' },
      { id: 26, propietario: PROPIETARIOS_DEMO[6], tipo: 'Cierre de sesión', fecha: '2026-04-26', hora: '20:18', dispositivo: 'Web · Chrome', ip: '190.78.45.18' },
      { id: 27, propietario: PROPIETARIOS_DEMO[2], tipo: 'Cierre de sesión', fecha: '2026-04-26', hora: '19:42', dispositivo: 'Android · Chrome', ip: '186.94.211.7' },
      { id: 28, propietario: PROPIETARIOS_DEMO[8], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '18:30', dispositivo: 'Android · App SIGRA', ip: '186.88.10.41' },
      { id: 29, propietario: PROPIETARIOS_DEMO[3], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '17:14', dispositivo: 'iOS · App SIGRA', ip: '190.202.99.21' },
      { id: 30, propietario: PROPIETARIOS_DEMO[1], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '15:42', dispositivo: 'iOS · Safari', ip: '190.202.45.112' },
      { id: 31, propietario: PROPIETARIOS_DEMO[7], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '14:08', dispositivo: 'iOS · App SIGRA', ip: '186.94.66.31' },
      { id: 32, propietario: PROPIETARIOS_DEMO[11], tipo: 'Cierre de sesión', fecha: '2026-04-26', hora: '12:55', dispositivo: 'Android · App SIGRA', ip: '190.202.71.40' },
      { id: 33, propietario: PROPIETARIOS_DEMO[5], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '11:18', dispositivo: 'Web · Edge', ip: '190.202.33.77' },
      { id: 34, propietario: PROPIETARIOS_DEMO[10], tipo: 'Cierre de sesión', fecha: '2026-04-26', hora: '10:42', dispositivo: 'Android · Chrome', ip: '186.88.55.91' },
      { id: 35, propietario: PROPIETARIOS_DEMO[4], tipo: 'Inicio de sesión', fecha: '2026-04-26', hora: '09:18', dispositivo: 'iOS · App SIGRA', ip: '186.88.140.55' },
    ],
    reportes: [
      { id: 1, propietario: PROPIETARIOS_DEMO[0], titulo: 'Filtración de agua en techo', categoria: 'Mantenimiento', fecha: '2026-04-28', estado: 'Pendiente' },
      { id: 2, propietario: PROPIETARIOS_DEMO[7], titulo: 'Ascensor de Torre B fuera de servicio', categoria: 'Mantenimiento', fecha: '2026-04-28', estado: 'Pendiente' },
      { id: 3, propietario: PROPIETARIOS_DEMO[3], titulo: 'Ruido excesivo apartamento vecino', categoria: 'Convivencia', fecha: '2026-04-27', estado: 'En revisión' },
      { id: 4, propietario: PROPIETARIOS_DEMO[6], titulo: 'Persona desconocida en pasillo', categoria: 'Seguridad', fecha: '2026-04-27', estado: 'En revisión' },
      { id: 5, propietario: PROPIETARIOS_DEMO[10], titulo: 'Solicitud de reserva del salón social', categoria: 'Áreas comunes', fecha: '2026-04-27', estado: 'Pendiente' },
      { id: 6, propietario: PROPIETARIOS_DEMO[2], titulo: 'Falla de iluminación pasillo', categoria: 'Áreas comunes', fecha: '2026-04-26', estado: 'Resuelto' },
      { id: 7, propietario: PROPIETARIOS_DEMO[8], titulo: 'Mascota suelta en áreas comunes', categoria: 'Convivencia', fecha: '2026-04-26', estado: 'Resuelto' },
      { id: 8, propietario: PROPIETARIOS_DEMO[4], titulo: 'Solicitud de mantenimiento ascensor', categoria: 'Mantenimiento', fecha: '2026-04-25', estado: 'En revisión' },
      { id: 9, propietario: PROPIETARIOS_DEMO[11], titulo: 'Goteo en tubería del estacionamiento', categoria: 'Mantenimiento', fecha: '2026-04-25', estado: 'Pendiente' },
      { id: 10, propietario: PROPIETARIOS_DEMO[1], titulo: 'Acceso no autorizado a estacionamiento', categoria: 'Seguridad', fecha: '2026-04-24', estado: 'Resuelto' },
      { id: 11, propietario: PROPIETARIOS_DEMO[5], titulo: 'Bombillo quemado en escalera', categoria: 'Mantenimiento', fecha: '2026-04-24', estado: 'Resuelto' },
      { id: 12, propietario: PROPIETARIOS_DEMO[9], titulo: 'Discusión entre vecinos en lobby', categoria: 'Convivencia', fecha: '2026-04-23', estado: 'Resuelto' },
      { id: 13, propietario: PROPIETARIOS_DEMO[6], titulo: 'Falla en cámara de vigilancia 3', categoria: 'Seguridad', fecha: '2026-04-23', estado: 'En revisión' },
      { id: 14, propietario: PROPIETARIOS_DEMO[7], titulo: 'Limpieza pendiente en piscina', categoria: 'Áreas comunes', fecha: '2026-04-22', estado: 'Resuelto' },
      { id: 15, propietario: PROPIETARIOS_DEMO[3], titulo: 'Fuga de gas reportada', categoria: 'Mantenimiento', fecha: '2026-04-21', estado: 'Resuelto' },
      { id: 16, propietario: PROPIETARIOS_DEMO[0], titulo: 'Robo de bicicleta del estacionamiento', categoria: 'Seguridad', fecha: '2026-04-20', estado: 'Resuelto' },
      { id: 17, propietario: PROPIETARIOS_DEMO[2], titulo: 'Olor desagradable en ducto de basura', categoria: 'Áreas comunes', fecha: '2026-04-19', estado: 'Resuelto' },
      { id: 18, propietario: PROPIETARIOS_DEMO[8], titulo: 'Vehículo mal estacionado bloqueando salida', categoria: 'Convivencia', fecha: '2026-04-18', estado: 'Resuelto' },
    ],
    pagos: [
      { id: 1, propietario: PROPIETARIOS_DEMO[0], estado: 'Solvente', ultimoPago: '2026-04-05', proximoVencimiento: '2026-05-05', diasRestantes: 7, monto: 'Bs. 320,00' },
      { id: 2, propietario: PROPIETARIOS_DEMO[1], estado: 'Por vencer', ultimoPago: '2026-03-28', proximoVencimiento: '2026-04-30', diasRestantes: 2, monto: 'Bs. 320,00' },
      { id: 3, propietario: PROPIETARIOS_DEMO[2], estado: 'Solvente', ultimoPago: '2026-04-10', proximoVencimiento: '2026-05-10', diasRestantes: 12, monto: 'Bs. 320,00' },
      { id: 4, propietario: PROPIETARIOS_DEMO[3], estado: 'Vencido', ultimoPago: '2026-02-15', proximoVencimiento: '2026-03-15', diasRestantes: -44, monto: 'Bs. 640,00' },
      { id: 5, propietario: PROPIETARIOS_DEMO[4], estado: 'Por vencer', ultimoPago: '2026-03-30', proximoVencimiento: '2026-05-02', diasRestantes: 4, monto: 'Bs. 320,00' },
      { id: 6, propietario: PROPIETARIOS_DEMO[5], estado: 'Vencido', ultimoPago: '2026-01-20', proximoVencimiento: '2026-02-20', diasRestantes: -67, monto: 'Bs. 960,00' },
      { id: 7, propietario: PROPIETARIOS_DEMO[6], estado: 'Solvente', ultimoPago: '2026-04-12', proximoVencimiento: '2026-05-12', diasRestantes: 14, monto: 'Bs. 320,00' },
      { id: 8, propietario: PROPIETARIOS_DEMO[7], estado: 'Solvente', ultimoPago: '2026-04-08', proximoVencimiento: '2026-05-08', diasRestantes: 10, monto: 'Bs. 320,00' },
      { id: 9, propietario: PROPIETARIOS_DEMO[8], estado: 'Por vencer', ultimoPago: '2026-04-01', proximoVencimiento: '2026-05-01', diasRestantes: 3, monto: 'Bs. 320,00' },
      { id: 10, propietario: PROPIETARIOS_DEMO[9], estado: 'Vencido', ultimoPago: '2026-02-28', proximoVencimiento: '2026-03-28', diasRestantes: -31, monto: 'Bs. 640,00' },
      { id: 11, propietario: PROPIETARIOS_DEMO[10], estado: 'Solvente', ultimoPago: '2026-04-15', proximoVencimiento: '2026-05-15', diasRestantes: 17, monto: 'Bs. 320,00' },
      { id: 12, propietario: PROPIETARIOS_DEMO[11], estado: 'Por vencer', ultimoPago: '2026-04-02', proximoVencimiento: '2026-05-02', diasRestantes: 4, monto: 'Bs. 320,00' },
    ],
  };
}

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private state$ = new BehaviorSubject<ActividadState>(this.load());

  readonly sesiones$ = new BehaviorSubject<RegistroSesion[]>(this.state$.value.sesiones);
  readonly reportes$ = new BehaviorSubject<RegistroReporte[]>(this.state$.value.reportes);
  readonly pagos$ = new BehaviorSubject<RegistroPago[]>(this.state$.value.pagos);

  constructor() {
    this.state$.subscribe(s => {
      this.sesiones$.next(s.sesiones);
      this.reportes$.next(s.reportes);
      this.pagos$.next(s.pagos);
    });
  }

  private load(): ActividadState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ActividadState;
    } catch {}
    const initial = seed();
    this.persist(initial);
    return initial;
  }

  private persist(s: ActividadState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  private commit(s: ActividadState) {
    this.persist(s);
    this.state$.next(s);
  }

  get propietarios(): Propietario[] {
    const set = new Map<string, Propietario>();
    [...this.state$.value.sesiones, ...this.state$.value.reportes, ...this.state$.value.pagos].forEach(r => {
      const k = `${r.propietario.nombre}|${r.propietario.apartamento}`;
      if (!set.has(k)) set.set(k, r.propietario);
    });
    PROPIETARIOS_DEMO.forEach(p => {
      const k = `${p.nombre}|${p.apartamento}`;
      if (!set.has(k)) set.set(k, p);
    });
    return Array.from(set.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  registrarSesion(propietario: Propietario, tipo: SesionTipo, dispositivo: string) {
    const now = new Date();
    const fecha = now.toISOString().slice(0, 10);
    const hora = now.toTimeString().slice(0, 5);
    const nuevo: RegistroSesion = {
      id: this.nextId(this.state$.value.sesiones),
      propietario,
      tipo,
      fecha,
      hora,
      dispositivo: dispositivo || 'Web · Admin SIGRA',
      ip: 'Registro manual',
    };
    const s = this.state$.value;
    this.commit({ ...s, sesiones: [nuevo, ...s.sesiones] });
  }

  registrarReporte(propietario: Propietario, titulo: string, categoria: string) {
    const fecha = new Date().toISOString().slice(0, 10);
    const nuevo: RegistroReporte = {
      id: this.nextId(this.state$.value.reportes),
      propietario,
      titulo,
      categoria,
      fecha,
      estado: 'Pendiente',
    };
    const s = this.state$.value;
    this.commit({ ...s, reportes: [nuevo, ...s.reportes] });
  }

  cambiarEstadoReporte(id: number, estado: ReporteEstado) {
    const s = this.state$.value;
    const reportes = s.reportes.map(r => r.id === id ? { ...r, estado } : r);
    this.commit({ ...s, reportes });
  }

  registrarPagoRecibido(id: number) {
    const s = this.state$.value;
    const hoy = new Date();
    const proximo = new Date(hoy);
    proximo.setMonth(proximo.getMonth() + 1);
    const pagos = s.pagos.map(p => p.id === id ? {
      ...p,
      estado: 'Solvente' as SolvenciaEstado,
      ultimoPago: hoy.toISOString().slice(0, 10),
      proximoVencimiento: proximo.toISOString().slice(0, 10),
      diasRestantes: 30,
    } : p);
    this.commit({ ...s, pagos });
  }

  resetData() {
    this.commit(seed());
  }

  private nextId(arr: { id: number }[]): number {
    return arr.length === 0 ? 1 : Math.max(...arr.map(x => x.id)) + 1;
  }
}
