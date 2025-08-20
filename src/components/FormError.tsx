interface FormErrorProps {
  error?: { message?: string } | null;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) {
    return null;
  }

  return <p className="text-sm text-red-500">{error.message}</p>;
};

export default FormError;
