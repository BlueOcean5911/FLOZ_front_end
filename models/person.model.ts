interface IPerson{
  _id?: string;
  role: string; // what`s type of role?
  email: string;
  projectId: string;
  updatedAt: Date;
  createdAt: Date;
}

export type { IPerson } 