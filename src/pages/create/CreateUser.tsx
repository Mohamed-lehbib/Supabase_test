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
  const [imageFile, setImageFile] = useState<File | undefined>(undefined); // State for profile image file
  const [documentFiles, setDocumentFiles] = useState<File[]>([]); // State for document files

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(imageFile);
    console.log(documentFiles);

    try {
      // Upload profile image
      await createUser(name, email, password, role, imageFile, documentFiles);

      console.log("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setImageFile(undefined); // Reset image file state after submission
      setDocumentFiles([]); // Reset document files state after submission
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", (error as Error).message);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const originalFileName = fileList[0].name;
      const sanitizedFileName = originalFileName.replace(/[^\w\s.-]/gi, " "); // Replace special characters with spaces
      const modifiedFile = new File([fileList[0]], sanitizedFileName);
      setImageFile(modifiedFile);
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFiles: File[] = Array.from(fileList);
      const validFiles = selectedFiles.filter(validateDocumentType);
      if (validFiles.length === selectedFiles.length) {
        setDocumentFiles(selectedFiles);
      } else {
        // Display an error message or handle invalid files here
        console.error("Invalid file type for one or more documents.");
      }
    }
  };

  // Function to validate document type
  const validateDocumentType = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
    ];
    return allowedTypes.includes(file.type);
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
          <label htmlFor="imageFile" className="block mb-1">
            Profile Image
          </label>
          <input
            type="file"
            id="imageFile"
            onChange={handleImageFileChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="documentFiles" className="block mb-1">
            Document Files
          </label>
          <input
            type="file"
            id="documentFiles"
            onChange={handleDocumentFileChange}
            multiple // Allow multiple file selection
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
