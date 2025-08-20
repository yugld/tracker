import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Введите корректный e-mail'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Минимум 2 символа').max(50, 'Слишком длинное имя'),
});

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;
