export const checkSpelling = async (
  input: string,
  dialect: 'uk' | 'us'
): Promise<string> => {
  const res = await fetch('/api/spellcheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, dialect }),
  });

  const data = await res.json();
  return data.result;
};
