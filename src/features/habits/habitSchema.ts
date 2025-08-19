import { z } from 'zod';

export const habitSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().max(500, 'Слишком длинное описание').optional(),
  category: z.string().min(1, 'Выберите категорию'),
  targetDays: z.number().min(1, 'Минимум 1 день').max(365, 'Максимум 365 дней'),
});

export type HabitFormData = z.infer<typeof habitSchema>;
