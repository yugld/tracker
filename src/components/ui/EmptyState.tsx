import { Card, CardContent } from '@/components/ui/card';

export default function EmptyState({ text }: { text: string }) {
  return (
    <Card className="my-4">
      <CardContent className="p-6 text-center text-muted-foreground">
        {text}
      </CardContent>
    </Card>
  );
}
