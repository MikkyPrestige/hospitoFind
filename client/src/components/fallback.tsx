import { Link } from 'react-router-dom';

type ErrorProps = {
  error: string
}

export const Fallback = ({ error }: ErrorProps) => {
  return (
    <div className="fallback" role='alert'>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.message}</p>
      <Link to='/'>Go back to home page</Link>
    </div>
  );
};
