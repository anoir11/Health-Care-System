export type DoctorDocumentType = 'CIN' | 'DIPLOMA' | 'CV' | 'LICENSE';

export interface UploadedDoc {
  file: File;
  type: DoctorDocumentType | null; // null until the user picks one
}
