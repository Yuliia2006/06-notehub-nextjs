'use client';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error }: Props) => {
  return <p>Не вдалося отримати список нотаток. {error.message}</p>;
};

export default Error;