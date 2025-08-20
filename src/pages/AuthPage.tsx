import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loginEmail,
  loginGoogle,
  registerEmail,
} from '@/features/auth/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastError } from '@/lib/toastError';
import {
  LoginData,
  RegisterData,
  registerSchema,
  loginSchema,
} from '@/zodSchemas/authSchema';
import FormError from '@/components/FormError';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const form = useForm<LoginData | RegisterData>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    mode: 'onTouched',
    defaultValues: isRegister
      ? ({ email: '', password: '', name: '' } as RegisterData)
      : ({ email: '', password: '' } as LoginData),
  });

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (values: LoginData | RegisterData) => {
    try {
      if (isRegister) {
        await dispatch(
          registerEmail({
            email: values.email,
            password: values.password,
            name: (values as RegisterData).name,
          }),
        ).unwrap();
        toast.success('Регистрация успешна');
      } else {
        await dispatch(
          loginEmail({ email: values.email, password: values.password }),
        ).unwrap();
        toast.success('Вход выполнен');
      }
    } catch (e: unknown) {
      toastError(e, 'Ошибка авторизации');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRegister ? 'Регистрация' : 'Вход'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {isRegister && (
              <>
                <Input
                  placeholder="Имя"
                  {...form.register('name' as keyof RegisterData)}
                />
                {(form.formState.errors as FieldErrors<RegisterData>).name && (
                  <p className="text-sm text-red-500">
                    {
                      (form.formState.errors as FieldErrors<RegisterData>).name
                        ?.message
                    }
                  </p>
                )}
              </>
            )}

            <Input
              type="email"
              placeholder="E-mail"
              {...form.register('email')}
            />
            <FormError error={form.formState.errors.email} />

            <Input
              type="password"
              placeholder="Пароль"
              {...form.register('password')}
            />
            <FormError error={form.formState.errors.password} />

            <Button
              className="w-full"
              type="submit"
              disabled={status === 'loading'}
            >
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </form>

          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={async () => {
              try {
                await dispatch(loginGoogle()).unwrap();
                toast.success('Вход через Google выполнен');
              } catch (e: unknown) {
                toastError(e, 'Ошибка входа через Google');
              }
            }}
          >
            Войти через Google
          </Button>

          <p className="mt-3 text-center text-sm">
            {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
            <Button
              variant="link"
              onClick={() => {
                setIsRegister((v) => !v);
                form.reset();
              }}
            >
              {isRegister ? 'Войти' : 'Регистрация'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
