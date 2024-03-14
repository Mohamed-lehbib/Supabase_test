import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetcher } from "../../api/api-fetcher/api-fetcher";
import { supabase } from "../../api/config/supabase";
import { fetchUser } from "../../queries/users/get-user-by-id/fetchUser";
import { updateUser } from "../../queries/users/update-user/updateUser";

export default function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await fetchUser(id);
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setPassword(user.password || "");
          setRole(user.role);
        }
      } catch (error) {
        console.error("Error fetching user:", (error as Error).message);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    // The type of the event was suggested by the idea
    event.preventDefault();

    try {
      await updateUser(id, name, email, password, role);
      console.log("User updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", (error as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="technician">Technician</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
