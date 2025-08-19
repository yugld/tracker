import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  useAddHabitMutation,
  useListHabitsQuery,
  useUpdateHabitMutation,
} from './habitsApi';
import { toast } from 'sonner';
import { toastError } from '@/lib/toastError';
import { HabitFormData } from './habitSchema';
import HabitForm from './HabitForm';

export default function HabitDialog({
  habitId,
  trigger,
  onDone,
}: {
  habitId?: string;
  trigger?: React.ReactNode;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: habits = [] } = useListHabitsQuery(undefined);
  const habit = habits.find((h) => h.id === habitId);

  const [addHabit, { isLoading: adding }] = useAddHabitMutation();
  const [updateHabit, { isLoading: updating }] = useUpdateHabitMutation();

  const handleSubmit = async (data: HabitFormData) => {
    try {
      if (habit) {
        await updateHabit({
          id: habit.id,
          patch: {
            title: data.title,
            description: data.description,
            category: data.category,
            targetDays: data.targetDays,
          },
        }).unwrap();
        toast.success('Привычка обновлена');
      } else {
        await addHabit({
          title: data.title,
          description: data.description,
          category: data.category,
          targetDays: data.targetDays,
        }).unwrap();
        toast.success('Привычка добавлена');
      }

      setOpen(false);
      onDone?.();
    } catch (e: unknown) {
      toastError(e, 'Ошибка сохранения привычки');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>Добавить привычку</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {habit ? 'Редактировать привычку' : 'Новая привычка'}
          </DialogTitle>
        </DialogHeader>

        <HabitForm
          defaultValues={
            habit
              ? {
                  title: habit.title,
                  description: habit.description,
                  category: habit.category,
                  targetDays: habit.targetDays,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          loading={adding || updating}
        />
      </DialogContent>
    </Dialog>
  );
}
