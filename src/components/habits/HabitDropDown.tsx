import { toastError } from '@/lib/toastError';

import { toast } from 'sonner';
import HabitDialog from './HabitDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/lib/types';
import { useDeleteHabitMutation } from '@/features/habits/habitsApi';

interface HabitDropDownProps {
  habit: Habit;
}

function HabitDropDown({ habit }: HabitDropDownProps) {
  const [deleteHabit] = useDeleteHabitMutation();
  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id).unwrap();
      toast.success('Привычка удалена');
    } catch (e: unknown) {
      toastError(e, 'Ошибка удаления привычки');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-fit flex-col gap-2 p-3"
      >
        <DropdownMenuItem asChild>
          <HabitDialog
            habitId={habit.id}
            trigger={
              <Button variant="outline" className="w-full">
                Редактировать
              </Button>
            }
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Удалить
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HabitDropDown;
