// src/app/services/pdf-export.service.ts
import { Injectable } from '@angular/core';
import { EmergencyContact, PatientProfile } from 'app/patient/profil/profile.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any)['vfs'];

interface InsuranceData {
  provider: string;
  policyNumber: string;
  expiryDate: Date;
  coverage: string;
  status: 'active' | 'expired';
}

const NAVY = '#0f172a';
const BLUE = '#2563eb';
const MUTED = '#64748b';
const BORDER = '#e4e8f0';
const DANGER = '#dc2626';
const SUCCESS = '#16a34a';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  exportProfile(
    profile: PatientProfile,
    fullName: string,
    age: number,
    bmi: string,
    bmiLabel: string,
    emergencyContacts: EmergencyContact[],
    insurance: InsuranceData,
  ): void {
    const generatedOn = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 100, 40, 60],

      header: this.buildHeader(fullName, generatedOn),
      footer: (currentPage, pageCount) => this.buildFooter(currentPage, pageCount),

      content: [
        this.buildPatientBanner(fullName, age, profile.gender, profile.city),
        this.buildStatRow(profile, bmi, bmiLabel),
        this.buildSectionTitle('Personal information'),
        this.buildPersonalTable(profile),
        this.buildSectionTitle('Emergency contacts'),
        this.buildEmergencyContacts(emergencyContacts),
        this.buildSectionTitle('Medical summary'),
        this.buildMedicalSummary(profile),
        this.buildSectionTitle('Insurance'),
        this.buildInsurance(insurance),
      ],

      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        color: NAVY,
      },
    };

    pdfMake.createPdf(docDefinition).download(`${fullName.replace(/\s+/g, '_')}_medical_profile.pdf`);
  }

  // ─── Header / Footer ────────────────────────────────────────────

  private buildHeader(fullName: string, generatedOn: string): Content {
    return {
      margin: [40, 30, 40, 0],
      columns: [
        {
          width: '*',
          stack: [
            { text: 'MediLink', fontSize: 16, bold: true, color: NAVY },
            { text: 'Patient medical profile', fontSize: 9, color: MUTED, margin: [0, 2, 0, 0] },
          ],
        },
        {
          width: 'auto',
          alignment: 'right',
          stack: [
            { text: `Generated on ${generatedOn}`, fontSize: 9, color: MUTED },
            { text: 'Confidential — for personal use only', fontSize: 8, color: MUTED, italics: true, margin: [0, 2, 0, 0] },
          ],
        },
      ],
    };
  }

  private buildFooter(currentPage: number, pageCount: number): Content {
    return {
      margin: [40, 0, 40, 20],
      columns: [
        { text: 'MediLink Health Platform', fontSize: 8, color: MUTED },
        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 8, color: MUTED, alignment: 'right' },
      ],
    };
  }

  // ─── Sections ───────────────────────────────────────────────────

  private buildPatientBanner(fullName: string, age: number, gender: string, city: string): Content {
    return {
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: [
                { text: fullName, fontSize: 18, bold: true, color: '#ffffff' },
                { text: `\n${age} years old  •  ${gender}  •  ${city}, Tunisia`, fontSize: 10, color: '#dbeafe' },
              ],
              fillColor: BLUE,
              margin: [16, 14, 16, 14],
            },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 16],
    };
  }

  private buildStatRow(profile: PatientProfile, bmi: string, bmiLabel: string): Content {
    const stat = (label: string, value: string, color = NAVY): any => ({
      width: '*',
      stack: [
        { text: value, fontSize: 13, bold: true, color, alignment: 'center' },
        { text: label, fontSize: 8, color: MUTED, alignment: 'center', margin: [0, 2, 0, 0] },
      ],
    });

    return {
      columns: [
        stat('Blood type', profile.bloodType, DANGER),
        stat('Height', `${profile.height} cm`),
        stat('Weight', `${profile.weight} kg`),
        stat('BMI', `${bmi} · ${bmiLabel}`),
        stat('Active doctors', String(profile.activeDoctors), BLUE),
      ],
      margin: [0, 0, 0, 20],
    };
  }

  private buildSectionTitle(title: string): Content {
    return {
      text: title,
      fontSize: 12,
      bold: true,
      color: NAVY,
      margin: [0, 12, 0, 8],
      border: [false, false, false, true],
      borderColor: [BORDER, BORDER, BORDER, BORDER],
    } as Content;
  }

  private buildPersonalTable(profile: PatientProfile): Content {
    const row = (label: string, value: string) => [
      { text: label, fontSize: 9, color: MUTED },
      { text: value || '—', fontSize: 10 },
    ];

    return {
      table: {
        widths: ['30%', '70%'],
        body: [
          row('First name', profile.firstName),
          row('Last name', profile.lastName),
          row('Gender', profile.gender),
          row('Nationality', profile.nationality),
          row(
            'Date of birth',
            new Date(profile.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
          ),
          row('Phone', profile.phone),
          row('Email', profile.email),
          row('Address', `${profile.address}, ${profile.city}`),
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => BORDER,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
      margin: [0, 0, 0, 8],
    };
  }

  private buildEmergencyContacts(contacts: EmergencyContact[]): Content {
    if (!contacts.length) {
      return { text: 'No emergency contacts on file.', fontSize: 9, color: MUTED, italics: true };
    }

    return {
      table: {
        widths: ['*', 'auto', 'auto'],
        headerRows: 1,
        body: [
          [
            { text: 'Name', fontSize: 8, bold: true, color: MUTED },
            { text: 'Relationship', fontSize: 8, bold: true, color: MUTED },
            { text: 'Phone', fontSize: 8, bold: true, color: MUTED },
          ],
          ...contacts.map(c => [
            { text: c.name, fontSize: 10, bold: true },
            { text: `${c.relationship} · ${c.role === 'primary' ? 'Primary' : 'Secondary'}`, fontSize: 9, color: MUTED },
            { text: c.phone, fontSize: 9 },
          ]),
        ],
      },
      layout: {
        hLineWidth: (i: number) => (i === 1 ? 1 : 0.5),
        vLineWidth: () => 0,
        hLineColor: () => BORDER,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
      margin: [0, 0, 0, 8],
    };
  }

  private buildMedicalSummary(profile: PatientProfile): Content {
    const tagRow = (label: string, items: string[], emptyText: string): Content => ({
      stack: [
        { text: label, fontSize: 9, color: MUTED, margin: [0, 0, 0, 4] },
        items.length
          ? { text: items.join('   •   '), fontSize: 10, margin: [0, 0, 0, 10] }
          : { text: emptyText, fontSize: 9, italics: true, color: MUTED, margin: [0, 0, 0, 10] },
      ],
    });

    return {
      stack: [
        tagRow('Allergies', profile.allergies, 'No known allergies'),
        tagRow('Chronic conditions', profile.conditions, 'No chronic conditions on file'),
        tagRow('Current medications', profile.currentMedications, 'No medications on file'),
        {
          columns: [
            { text: `Smoking: ${profile.smoking ? 'Yes' : 'No'}`, fontSize: 10, width: '*' },
            { text: `Alcohol: ${profile.alcohol ? 'Yes' : 'No'}`, fontSize: 10, width: '*' },
          ],
        },
      ],
    };
  }

  private buildInsurance(insurance: InsuranceData): Content {
    const statusColor = insurance.status === 'active' ? SUCCESS : DANGER;

    return {
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                { text: insurance.provider, fontSize: 12, bold: true, margin: [0, 0, 0, 8] },
                {
                  columns: [
                    {
                      text: [
                        { text: 'Policy no.\n', fontSize: 8, color: MUTED },
                        { text: insurance.policyNumber, fontSize: 10 },
                      ],
                      width: '*',
                    },
                    {
                      text: [
                        { text: 'Expires\n', fontSize: 8, color: MUTED },
                        {
                          text: insurance.expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                          fontSize: 10,
                        },
                      ],
                      width: '*',
                    },
                    {
                      text: [
                        { text: 'Coverage\n', fontSize: 8, color: MUTED },
                        { text: insurance.coverage, fontSize: 10 },
                      ],
                      width: '*',
                    },
                    {
                      text: [
                        { text: 'Status\n', fontSize: 8, color: MUTED },
                        { text: insurance.status === 'active' ? 'Active' : 'Expired', fontSize: 10, bold: true, color: statusColor },
                      ],
                      width: '*',
                    },
                  ],
                },
              ],
              fillColor: '#f8fafc',
              margin: [14, 14, 14, 14],
            },
          ],
        ],
      },
      layout: 'noBorders',
    };
  }
}
