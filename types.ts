
export interface Person {
  name: string;
  cpf: string;
  rg: string;
  civilStatus: string;
  profession: string;
  address: string;
  email: string;
  phone: string;
}

export interface PropertyDetails {
  address: string;
  roomDescription: string;
  vagaType: string; // Suite, Individual, etc.
  sharedAreas: string;
}

export interface Contract {
  id: string;
  locador: Person;
  locatario: Person;
  property: PropertyDetails;
  startDate: string;
  durationMonths: number;
  monthlyRent: number;
  paymentDay: number;
  pixKey: string;
  status: 'active' | 'finished' | 'draft';
  createdAt: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  status: string; // e.g., "Pintura nova", "Pequeno risco no canto"
  photoUrl?: string;
}

export interface Inspection {
  contractId: string;
  date: string;
  items: {
    room: InspectionItem[];
    common: InspectionItem[];
  };
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}
