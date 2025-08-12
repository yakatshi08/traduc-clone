// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\types\auth.types.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}