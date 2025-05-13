type Params = Promise<{ tag: string; channel: string }>;
type Props = { params: Params };

export default async function Home({ params }: Props) {
  const { tag, channel } = await params;
  return (
    <div>
      <pre>{JSON.stringify({ tag, channel }, null, 2)}</pre>
    </div>
  );
}
