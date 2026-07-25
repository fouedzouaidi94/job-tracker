export type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';

export interface Application {
  id: number;
  company: string;
  role: string;
  status: Status;
  location: string;
  salary_range: string;
  applied_date: string;
  notes: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = Omit<Application, 'id' | 'created_at' | 'updated_at'>;
