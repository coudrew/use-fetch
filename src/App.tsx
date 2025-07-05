import "./App.css";
import { useFetch } from "./hooks/useFetch/use-fetch";
import { PokeCard } from "./components/PokeCard";
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const { data, isLoading, error } = useFetch<{
    results: { name: string; url: string }[];
  }>({
    url: `${apiUrl}/pokemon?limit=${9}&&offset=${0}`,
  });

  if (isLoading) return <p>loading..</p>;
  if (error) return <p>something went wrong</p>;
  if (!data) return <p>no pokemon found</p>;
  return (
    <>
      {data.results.map(({ name }) => (
        <PokeCard key={name} name={name} />
      ))}
    </>
  );
}

export default App;
