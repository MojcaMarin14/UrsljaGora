export async function fetchAPI(path: string) {
  const res = await fetch(`http://localhost:1337/api/${path}?populate=*`);
  return res.json();
}
