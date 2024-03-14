import React, { useState } from "react";
import { supabase } from "../../api/config/supabase";
import { apiFetcher } from "../../api/api-fetcher/api-fetcher";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../queries/users/create-user/createUser";

export default function CreateUserForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined); // New state for the selected file

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(file);

    try {
      await createUser(name, email, password, role, file);
      console.log("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setFile(undefined); // Reset file state after submission
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", (error as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
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
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <div>
          <label htmlFor="file" className="block mb-1">
            Profile Image
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList && fileList.length > 0) {
                setFile(fileList[0]);
              }
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
