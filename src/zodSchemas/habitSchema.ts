import { z } from 'zod';
import { isValid, parse } from 'date-fns';

export const habitDoneDatesDateSchema = z.string().refine((date) => {
  try {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

    return isValid(parsedDate);
  } catch {
    return false;
  }
}, 'Невалидная дата. Формат должен быть yyyy-MM-dd');

export type HabitDoneDatesDate = z.infer<typeof habitDoneDatesDateSchema>;

export const habitSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().max(500, 'Слишком длинное описание').optional(),
  category: z.string().min(1, 'Выберите категорию'),
  targetDays: z.number().min(1, 'Минимум 1 день').max(365, 'Максимум 365 дней'),
  doneDates: z.array(habitDoneDatesDateSchema),
});

export type HabitFormData = z.infer<typeof habitSchema>;
