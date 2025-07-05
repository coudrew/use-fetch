import { useFetch } from "../hooks/useFetch/use-fetch";
import { Card, CardTitle } from "./ui/card";

const apiUrl = import.meta.env.VITE_API_URL;

interface PokeCardProps {
  name: string;
}

export function PokeCard({ name }: PokeCardProps) {
  const { data, isLoading, error } = useFetch({
    url: `${apiUrl}/pokemon-species/${name}`,
  });

  console.log(data);
  if (isLoading) return <p>loading</p>;
  if (error) return <p>something went wrong</p>;
  if (!data) return null;

  return (
    <Card>
      <CardTitle>{data.name}</CardTitle>
    </Card>
  );
}
