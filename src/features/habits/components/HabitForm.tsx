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
import { habitSchema, HabitFormData } from '@/zodSchemas/habitSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { categoryOptions } from '@/constants/categoryOptions';
import { dateToString, stringToDate } from '@/lib/dateConverting';
import FormError from '@/components/FormError';

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
      doneDates: [],
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Название" {...form.register('title')} />
        <FormError error={form.formState.errors.title} />

        <Textarea placeholder="Описание" {...form.register('description')} />
        <FormError error={form.formState.errors.description} />

        <Select
          onValueChange={(val) => form.setValue('category', val)}
          defaultValue={form.getValues('category')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent className="p-2">
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormError error={form.formState.errors.category} />

        <Input
          type="number"
          placeholder="Количество дней"
          {...form.register('targetDays', { valueAsNumber: true })}
        />
        <FormError error={form.formState.errors.targetDays} />

        <FormField
          control={form.control}
          name="doneDates"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-center gap-2">
              <FormLabel className="text-md w-full text-center">
                Дни с привычкой
              </FormLabel>
              <FormControl>
                <Calendar
                  className="w-full"
                  mode="multiple"
                  selected={field.value?.map(stringToDate)}
                  weekStartsOn={1}
                  disabled={(date) => date > new Date()}
                  onSelect={(dates) =>
                    field.onChange(
                      dates
                        ?.map(dateToString)
                        .sort((a, b) => b.localeCompare(a)) ?? [],
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={loading}>
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
