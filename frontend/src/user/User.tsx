import axios from "axios";
import { useEffect, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/user", { withCredentials: true })
      .then(({ data }) => {
        console.log({ data });
        setUser(data.username);
      });
  }, []);
  return <div>User - {user}</div>;
}
