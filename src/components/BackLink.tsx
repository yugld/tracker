import { ChevronLeftIcon } from 'lucide-react';
import { Button } from './ui/button';

const BackLink = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Button variant="secondary" onClick={handleGoBack} className="w-fit">
      <ChevronLeftIcon /> Назад
    </Button>
  );
};

export default BackLink;
