import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col gap-5">
      <div
        onChange={(e) => {
          setUsername((e.target as HTMLInputElement).value);
        }}
      >
        Username : <input />
      </div>
      <div
        onChange={(e) => {
          setPassword((e.target as HTMLInputElement).value);
        }}
      >
        Password :
        <input />
      </div>
      <button
        onClick={async () => {
          console.log({ username, password });
          const { data } = await axios.post(
            "http://localhost:3000/signin",
            {
              username,
              password,
            },
            { withCredentials: true },
          );
          if (data.success) {
            alert("login successful");
          } else {
            alert("login failed");
          }
        }}
      >
        Login
      </button>
    </div>
  );
}
