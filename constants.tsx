
import { User, Role, ClubRole, Club, Applicant, Event, AuditLog, Registration, Venue } from './types';

export const CLUBS: Club[] = [];

export const DEMO_USERS: User[] = [];

export const INITIAL_APPLICANTS: Applicant[] = [];

export const EVENTS: Event[] = [];

export const INITIAL_REGISTRATIONS: Registration[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'venue-1',
    name: 'SAC Auditorium',
    capacity: 500,
    location: 'Student Activity Center',
    resources: ['Projector', 'Dolby Sound', 'Stage Lighting', 'AC'],
    isMaintenance: false
  },
  {
    id: 'venue-2',
    name: 'Conclave Seminar Hall',
    capacity: 120,
    location: 'Main Building - 2nd Floor',
    resources: ['Smart Board', 'Video Conferencing', 'Podium'],
    isMaintenance: false
  },
  {
    id: 'venue-3',
    name: 'Cricket Ground',
    capacity: 2000,
    location: 'Sports Complex',
    resources: ['Floodlights', 'Pavilion', 'PA System'],
    isMaintenance: false
  },
  {
    id: 'venue-4',
    name: 'MITS Board Room',
    capacity: 40,
    location: 'Admin Block',
    resources: ['Round Table', 'Display Screen', 'AC'],
    isMaintenance: false
  }
];
