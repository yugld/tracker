import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { habitSchema, HabitFormData } from './habitSchema';

export default function HabitForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<HabitFormData>;
  onSubmit: (data: HabitFormData) => Promise<void> | void;
  loading?: boolean;
}) {
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      targetDays: 21,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input placeholder="Название" {...form.register('title')} />
      {form.formState.errors.title && (
        <p className="text-sm text-red-500">
          {form.formState.errors.title.message}
        </p>
      )}

      <Textarea placeholder="Описание" {...form.register('description')} />
      {form.formState.errors.description && (
        <p className="text-sm text-red-500">
          {form.formState.errors.description.message}
        </p>
      )}

      <Select
        onValueChange={(val) => form.setValue('category', val)}
        defaultValue={form.getValues('category')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="health">Здоровье</SelectItem>
          <SelectItem value="productivity">Продуктивность</SelectItem>
          <SelectItem value="learning">Обучение</SelectItem>
          <SelectItem value="other">Другое</SelectItem>
        </SelectContent>
      </Select>
      {form.formState.errors.category && (
        <p className="text-sm text-red-500">
          {form.formState.errors.category.message}
        </p>
      )}

      <Input
        type="number"
        placeholder="Количество дней"
        {...form.register('targetDays', { valueAsNumber: true })}
      />
      {form.formState.errors.targetDays && (
        <p className="text-sm text-red-500">
          {form.formState.errors.targetDays.message}
        </p>
      )}

      <Button className="w-full" type="submit" disabled={loading}>
        Сохранить
      </Button>
    </form>
  );
}
