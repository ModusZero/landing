import type { ContactConfig } from "@/types/contact-config";

export const contactConfig: ContactConfig = {
    title: 'contact.title',
    subtitle: 'contact.subtitle',
    benefits: [
        'contact.benefits.b1',
        'contact.benefits.b2',
        'contact.benefits.b3',
        'contact.benefits.b4',
    ],
    email: 'luisalbertohedzro@gmail.com',
    form: {
        cta: 'contact.form.cta',
        fields: [
            { title: 'Name', label: 'contact.form.name_label', placeholder: 'contact.form.name_placeholder', required: true },
            { title: 'Email', label: 'contact.form.email_label', placeholder: 'contact.form.email_placeholder', required: true },
            { title: 'Subject', label: 'contact.form.subject_label', placeholder: 'contact.form.subject_placeholder', required: true },
            { title: 'Company', label: 'contact.form.company_label', placeholder: 'contact.form.company_placeholder', required: false },
            { title: 'Message', label: 'contact.form.message_label', placeholder: 'contact.form.message_placeholder', required: false },
        ]
    },
};