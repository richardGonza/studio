export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Pending' | 'Case Created';
  registeredOn: string;
  avatarUrl: string;
};

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  expertise: string;
  availability: string;
  avatarUrl: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  manager: string;
};

export type Case = {
  id: string;
  title: string;
  clientName: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'On Hold' | 'Closed';
  lastUpdate: string;
  category: 'Contenciosa' | 'No Contenciosa';
  opportunityLifecycle: number;
};

export const users: User[] = [
  { id: 'USR001', name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', status: 'Case Created', registeredOn: '2023-10-26', avatarUrl: 'https://picsum.photos/seed/avatar1/40/40' },
  { id: 'USR002', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', status: 'Contacted', registeredOn: '2023-10-25', avatarUrl: 'https://picsum.photos/seed/avatar2/40/40' },
  { id: 'USR003', name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-4444', status: 'New', registeredOn: '2023-10-27', avatarUrl: 'https://picsum.photos/seed/avatar3/40/40' },
  { id: 'USR004', name: 'Daniel Alves', email: 'daniel.alves@example.com', phone: '(41) 94321-8765', status: 'Pending', registeredOn: '2023-10-24', avatarUrl: 'https://picsum.photos/seed/avatar4/40/40' },
  { id: 'USR005', name: 'Beatriz Lima', email: 'beatriz.lima@example.com', phone: '(51) 98877-6655', status: 'New', registeredOn: '2023-10-28', avatarUrl: 'https://picsum.photos/seed/avatar5/40/40' },
];

export const volunteers: Volunteer[] = [
  { id: 'VOL001', name: 'Eduardo Martins', email: 'eduardo.m@example.com', expertise: 'Civil Law', availability: 'Weekends', avatarUrl: 'https://picsum.photos/seed/avatar6/40/40' },
  { id: 'VOL002', name: 'Fernanda Lima', email: 'fernanda.l@example.com', expertise: 'Criminal Law', availability: 'Weekdays', avatarUrl: 'https://picsum.photos/seed/avatar7/40/40' },
  { id: 'VOL003', name: 'Gabriel Rocha', email: 'gabriel.r@example.com', expertise: 'Family Law', availability: 'Weekends', avatarUrl: 'https://picsum.photos/seed/avatar8/40/40' },
];

export const branches: Branch[] = [
    { id: 'BRH001', name: 'Central Office', address: '123 Main St, Cityville', manager: 'Ricardo Gomes' },
    { id: 'BRH002', name: 'North Branch', address: '456 North Ave, Townburg', manager: 'Helena Souza' },
];

export const cases: Case[] = [
  { id: 'CAS001', title: 'Amparo Constitucional vs. State', clientName: 'Ana Silva', assignedTo: 'Eduardo Martins', status: 'In Progress', lastUpdate: '2023-11-01', category: 'Contenciosa', opportunityLifecycle: 75 },
  { id: 'CAS002', title: 'Property Dispute Resolution', clientName: 'John Doe', assignedTo: 'Fernanda Lima', status: 'Open', lastUpdate: '2023-10-30', category: 'No Contenciosa', opportunityLifecycle: 25 },
  { id: 'CAS003', title: 'Labor Rights Claim', clientName: 'Jane Smith', assignedTo: 'Eduardo Martins', status: 'Closed', lastUpdate: '2023-09-15', category: 'Contenciosa', opportunityLifecycle: 100 },
  { id: 'CAS004', title: 'Divorce Proceedings', clientName: 'Bruno Costa', assignedTo: 'Gabriel Rocha', status: 'On Hold', lastUpdate: '2023-11-05', category: 'No Contenciosa', opportunityLifecycle: 50 },
];

export const notifications = [
    { id: 1, text: 'New opportunity "Carla Dias" registered.', time: '10 min ago', read: false },
    { id: 2, text: 'Case #CAS001 status updated to "In Progress".', time: '1 hour ago', read: false },
    { id: 3, text: 'Volunteer "Fernanda Lima" just signed up.', time: '3 hours ago', read: true },
    { id: 4, text: 'Document uploaded for case #CAS002.', time: '1 day ago', read: true },
];
