

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
  previewUrl?: string; // For UI display
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isError?: boolean;
}

export enum AppView {
  LANDING = 'landing',
  LOGIN = 'login',
  REGISTER = 'register',
  ADMIN_LOGIN = 'admin_login',
  ADMIN_REGISTER = 'admin_register',
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  APPOINTMENTS = 'appointment',
  TREATMENTS = 'treatments',
  CONTACT = 'contact',
  CONSULTATION = 'consultation',
  DOCTOR_CHAT = 'doctor_chat',
  WELLNESS = 'wellness',
  PERSONNEL = 'personnel',
  PATIENTS = 'patients',
  PAYMENTS = 'payments',
  DOCUMENTS = 'documents',
  APPLICATIONS = 'applications' // EKLENDİ
}

export enum AdminView {
  DASHBOARD = 'dashboard',
  APPOINTMENTS = 'appointments',
  PERSONNEL = 'personnel'
}

export interface Appointment {
  id: string;
  userId: string;
  patientName: string;
  tcNo: string;
  date: string;
  time: string;
  type: string;
  description: string;
  images: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Uzman' | 'Estetisyen' | 'Danışman' | 'Asistan';
  phone: string;
  status: 'active' | 'leave';
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
}

export interface TreatmentCategory {
    category: string;
    items: Treatment[];
}

export interface RecoveryGuide {
    id: string;
    title: string;
    icon: string;
    content: string[];
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  earnings: number;
  activeTreatments: number;
}

export interface User {
  uid: string;
  name: string;
  surname: string;
  email: string;
  role: 'admin' | 'patient';
  tcNo?: string;
  phone?: string;
  avatar?: string;
  relativeName?: string;
  relativePhone?: string;
  totalVisits?: number;
  status?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  patientId: string;
  patientName: string;
  role: 'admin' | 'patient';
  isRead: boolean;
  timestamp: any;
}

export interface ServiceRecord {
    id: string;
    userId: string;
    treatment: string; // Uygulanan İşlem
    status: 'planned' | 'completed' | 'active';
    date: string;
    startTime?: string;
    endTime?: string;
    doctor: string; // İşlemi Yapan Uzman
    notes: string;
    // YENİ ALANLAR
    totalSessions?: number;
    completedSessions?: number;
    instructions?: string; // Yapılması/Yapılmaması gerekenler
}

export interface Payment {
    id: string;
    userId: string;
    patientName: string;
    amount: number;
    description: string;
    cardNumberMasked: string;
    status: 'approved' | 'pending' | 'rejected';
    date: string;
}

export interface Patient extends User {
    entryTime?: string;
    exitTime?: string;
}