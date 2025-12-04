


import { User, Appointment, ChatMessage, ServiceRecord, Payment, Staff } from '../types';

// Mock Data Storage (resets on reload)
let mockUsers: User[] = [
    { uid: 'admin1', name: 'Zeynep', surname: 'Kaya', email: 'admin@aesthetix.com', role: 'admin' },
    { uid: 'patient1', name: 'Selin', surname: 'Kaya', email: 'selin@test.com', role: 'patient', tcNo: '12345678901', phone: '0532 100 20 30' },
    { uid: '2', name: 'Ayşe', surname: 'Demir', email: 'ayse@test.com', role: 'patient', tcNo: '23456789012', phone: '0533 200 30 40' }
];

let mockAppointments: Appointment[] = [];
let mockMessages: ChatMessage[] = [];
// Updated Mock Records to match patient IDs correctly for "History View"
let mockRecords: ServiceRecord[] = [
    { 
        id: '1', 
        userId: 'patient1', 
        treatment: 'Saç Ekimi (DHI)', 
        status: 'completed', 
        date: '2023-05-12', 
        startTime: '09:00', 
        endTime: '16:00', 
        doctor: 'Ali Yılmaz', 
        notes: '3500 Greft. Ön hat çalışması.',
        totalSessions: 1,
        completedSessions: 1,
        instructions: '- İlk 3 gün su değdirmeyin.\n- Şapka takmayın.\n- Verilen losyonu kullanın.'
    },
    { 
        id: '2', 
        userId: 'patient1', 
        treatment: 'Lazer Epilasyon', 
        status: 'active', 
        date: '2023-06-15', 
        startTime: '14:00', 
        endTime: '14:30', 
        doctor: 'Uzm. Dr. Zeynep', 
        notes: 'Tüm bacak seansı.',
        totalSessions: 8,
        completedSessions: 3,
        instructions: '- Güneşe çıkmayın.\n- Kese yapmayın.\n- Sıcak duş almayın.'
    },
    { id: '3', userId: 'patient1', treatment: 'Mezoterapi', status: 'planned', date: '2025-06-01', startTime: '10:00', endTime: '10:30', doctor: 'Uzm. Dr. Zeynep', notes: 'Saç güçlendirme kokteyli.' },
    { id: '4', userId: '2', treatment: 'Botoks', status: 'completed', date: '2023-11-20', startTime: '15:00', endTime: '15:30', doctor: 'Op. Dr. Mehmet', notes: 'Masseter botoksu yapıldı.' },
    { id: '5', userId: '2', treatment: 'Gençlik Aşısı', status: 'completed', date: '2024-01-10', startTime: '11:00', endTime: '11:45', doctor: 'Op. Dr. Mehmet', notes: 'H-100 aşısı.' }
];

let mockPayments: Payment[] = [];
let mockStaff: Staff[] = [
    { id: '1', name: 'Op. Dr. Mehmet Öz', role: 'Uzman', phone: '0555 111 22 33', status: 'active' },
    { id: '2', name: 'Ali Yılmaz', role: 'Estetisyen', phone: '0555 222 33 44', status: 'active' }
];

let currentUser: User | null = null;

// --- AUTHENTICATION ---
export const subscribeToAuth = (callback: (user: User | null) => void) => {
    setTimeout(() => {
        const storedUser = localStorage.getItem('aesthetix_user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            callback(currentUser);
        } else {
            callback(null);
        }
    }, 500);
    return () => {};
};

export const loginUser = async (email: string, pass: string): Promise<{success: boolean, userData: any, error?: string}> => {
    const user = mockUsers.find(u => u.email === email || (u.tcNo && `${u.tcNo}@aesthetix.com` === email));
    if (user) {
        currentUser = user;
        localStorage.setItem('aesthetix_user', JSON.stringify(user));
        return { success: true, userData: user };
    }
    return { success: false, userData: null, error: "Kullanıcı bulunamadı" };
};

export const registerUser = async (email: string, pass: string, data: any): Promise<{success: boolean, error?: string}> => {
    const newUser: User = {
        uid: Date.now().toString(),
        name: data.name,
        surname: data.surname,
        email: email,
        role: 'patient',
        tcNo: data.tcNo,
        phone: data.phone,
        relativeName: data.relativeName,
        relativePhone: data.relativePhone
    };
    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('aesthetix_user', JSON.stringify(newUser));
    return { success: true };
};

export const registerAdmin = async (email: string, pass: string, data: any): Promise<{success: boolean, error?: string}> => {
    // Admin Master Key Check (Simple simulation)
    if (data.adminCode !== 'wasd123wasd') {
        return { success: false, error: 'Geçersiz Yönetici PIN Kodu!' };
    }

    const newUser: User = {
        uid: Date.now().toString(),
        name: data.name,
        surname: data.surname,
        email: email,
        role: 'admin',
        phone: data.phone,
    };
    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('aesthetix_user', JSON.stringify(newUser));
    return { success: true };
};

export const logoutUser = async () => {
    currentUser = null;
    localStorage.removeItem('aesthetix_user');
};

export const getCurrentUser = () => currentUser;

export const updateUserRole = async (uid: string, role: 'admin' | 'patient') => {
    const user = mockUsers.find(u => u.uid === uid);
    if (user) {
        user.role = role;
        if (currentUser && currentUser.uid === uid) {
            currentUser.role = role;
            localStorage.setItem('aesthetix_user', JSON.stringify(currentUser));
        }
    }
};

// --- APPOINTMENTS ---
export const subscribeToAppointments = (callback: (data: Appointment[]) => void, userId?: string, role?: string) => {
    setTimeout(() => {
        if (role === 'admin') {
            callback(mockAppointments);
        } else {
            callback(mockAppointments.filter(a => a.userId === userId));
        }
    }, 100);
    return () => {};
};

export const addAppointment = async (appt: Partial<Appointment>) => {
    const newAppt: Appointment = {
        id: Date.now().toString(),
        userId: appt.userId!,
        patientName: appt.patientName!,
        tcNo: appt.tcNo!,
        date: appt.date!,
        time: appt.time!,
        type: appt.type!,
        description: appt.description || '',
        images: appt.images as string[] || [],
        status: 'pending',
        price: 0
    };
    mockAppointments.push(newAppt);
};

export const updateAppointmentStatus = async (id: string, status: any) => {
    const apt = mockAppointments.find(a => a.id === id);
    if (apt) apt.status = status;
};

// --- MESSAGES ---
export const subscribeToAllMessages = (callback: (msgs: ChatMessage[]) => void) => {
    const interval = setInterval(() => callback([...mockMessages]), 2000);
    return () => clearInterval(interval);
};

export const subscribeToMessages = (userId: string, callback: (msgs: ChatMessage[]) => void) => {
    const interval = setInterval(() => {
        const msgs = mockMessages.filter(m => m.patientId === userId);
        callback(msgs);
    }, 2000);
    return () => clearInterval(interval);
};

export const sendMessage = async (msg: any) => {
    mockMessages.push({
        id: Date.now().toString(),
        ...msg,
        timestamp: new Date()
    });
};

// --- PAYMENTS ---
export const subscribeToPayments = (callback: (data: Payment[]) => void, userId?: string, role?: string) => {
    const interval = setInterval(() => {
        if (role === 'admin') callback([...mockPayments]);
        else callback(mockPayments.filter(p => p.userId === userId));
    }, 1000);
    return () => clearInterval(interval);
};

export const addPayment = async (payment: any) => {
    mockPayments.push({
        id: Date.now().toString(),
        ...payment
    });
};

export const updatePaymentStatus = async (id: string, status: 'approved' | 'rejected') => {
    const pay = mockPayments.find(p => p.id === id);
    if (pay) pay.status = status;
};

// --- STAFF ---
export const subscribeToStaff = (callback: (data: Staff[]) => void) => {
    setTimeout(() => callback([...mockStaff]), 100);
    return () => {};
};

export const addStaff = async (staff: Staff) => {
    mockStaff.push({ ...staff, id: Date.now().toString() });
};

export const deleteStaff = async (id: string) => {
    mockStaff = mockStaff.filter(s => s.id !== id);
};

// --- PATIENTS ---
export const subscribeToPatients = (callback: (data: any[]) => void) => {
    const interval = setInterval(() => {
        callback(mockUsers.filter(u => u.role === 'patient'));
    }, 1000);
    return () => clearInterval(interval);
};

export const addPatient = async (patientData: any) => {
    const newUser: User = {
        uid: Date.now().toString(),
        role: 'patient',
        ...patientData
    };
    mockUsers.push(newUser);
};

export const updatePatient = async (id: string, patientData: any) => {
    const idx = mockUsers.findIndex(u => u.uid === id);
    if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...patientData };
    }
};

export const deletePatient = async (id: string) => {
    mockUsers = mockUsers.filter(u => u.uid !== id);
};

// --- DOCUMENTS (SERVICE RECORDS & APPLICATIONS) ---
export const subscribeToDentalRecords = (callback: (data: ServiceRecord[]) => void, userId: string) => {
    setTimeout(() => {
        // userId parametresine göre filtreleme yapılıyor.
        const patientRecords = mockRecords.filter(r => r.userId === userId);
        callback(patientRecords);
    }, 200);
    return () => {};
};

export const subscribeToAllServiceRecords = (callback: (data: ServiceRecord[]) => void) => {
     setTimeout(() => {
        callback(mockRecords);
    }, 200);
    return () => {};
};

export const addDentalRecord = async (record: ServiceRecord) => {
    mockRecords.push(record);
};

export const updateDentalRecord = async (id: string, data: Partial<ServiceRecord>) => {
     const idx = mockRecords.findIndex(r => r.id === id);
     if(idx !== -1) {
         mockRecords[idx] = { ...mockRecords[idx], ...data };
     }
}

export const deleteDentalRecord = async (id: string) => {
    mockRecords = mockRecords.filter(r => r.id !== id);
};