function Error({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>
        <span>💥</span> Could not load the quiz questions. {message}
      </p>
      <button className="btn btn-ui" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default Error;
