import { toast } from 'sonner';

export function toastError(e: unknown, defaultMessage = 'Произошла ошибка') {
  const message = e instanceof Error ? e.message : defaultMessage;

  toast.error(message);
}
