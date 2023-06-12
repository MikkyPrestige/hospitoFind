import useLogout from "@/hooks/logOut";

const Logout = () => {
  const { logout, loading, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Bye..." : "Logout"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Logout