import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import Input from '@components/ui/input';
import PasswordInput from '@components/ui/password-input';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTES } from '@utils/routes';
import { useLoginMutation } from '@data/user/use-login.mutation';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from '@components/ui/link';
import { allowedRoles, hasAccess, setAuthCredentials } from '@utils/auth-utils';

type FormValues = {
  email: string;
  password: string;
};
const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});
const defaultValues = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const { mutate: login, isLoading: loading } = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(loginFormSchema),
  });
  const router = useRouter();

  function onSubmit({ email, password }: FormValues) {
    login(
      {
        variables: {
          email,
          password,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(
                data?.token,
                data?.permissions,
                data?.internalToken
              );
              router.push(ROUTES.DASHBOARD);
              return;
            }
            setErrorMsg('form:error-enough-permission');
          } else {
            setErrorMsg('form:error-credential-wrong');
          }
        },
        onError: () => {},
      }
    );
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t('form:input-label-email')}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t('form:input-label-password')}
          forgotPassHelpText={t('form:input-forgot-password-label')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
          forgotPageLink="/forgot-password"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          {t('form:button-label-login')}
        </Button>

        <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
          <hr className="w-full" />
          <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
            {t('common:text-or')}
          </span>
        </div>

        <div className="text-center text-sm text-body sm:text-base">
          {t('form:text-no-account')}{' '}
          <Link
            href="/register"
            className="focus:outline-none font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline"
          >
            {t('form:link-register-shop-owner')}
          </Link>
        </div>

        {errorMsg ? (
          <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg('')}
          />
        ) : null}
      </form>
    </>
  );
};

export default LoginForm;
