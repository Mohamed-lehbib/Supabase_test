import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../queries/users/get-all-user/fetchUsers";
import { deleteUser } from "../../queries/users/delete-user/deleteUser";

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [listlen, setListlen] = useState(users.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await fetchUsers(
        searchQuery,
        selectedRole || undefined
      );
      setUsers(fetchedUsers);
    }

    fetchData();
  }, [searchQuery, selectedRole, listlen]);

  const roles = ["admin", "user", "technician"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">List of Users</h1>
        <Link
          to="/create"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition duration-300"
        >
          Create User
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          value={selectedRole || ""}
          onChange={(e) => setSelectedRole(e.target.value || undefined)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Filter by Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Password</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.password}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/${user.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg mr-2">
                    Edit
                  </button>
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                  onClick={() => deleteUser(user.id, setListlen)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
