interface IPerson {
  _id?: string;
  name: string;
  role: string; // what`s type of role?
  email: string;
  phone: string;
  projectId: string;
  updatedAt: Date;
  createdAt: Date;
}

export type { IPerson } 