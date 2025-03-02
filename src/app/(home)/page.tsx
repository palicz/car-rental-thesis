import { trpc } from '@/trpc/server';

export default async function Home() {
  const data = await trpc.hello({ text: 'Dany' });

  return <div>Client component data: {data.greeting}</div>;
}
