interface Props {
  email: string;
  logout: () => void;
}

export function LogoutButton({ email, logout }: Props) {
  return (
    <div>
      <p className="text-sm">Logged in as {email}</p>
      <button
        className="mt-1 text-red-500"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
