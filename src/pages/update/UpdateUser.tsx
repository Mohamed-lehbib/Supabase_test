import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser } from "../../queries/users/get-user-by-id/fetchUser";
import { updateUser } from "../../queries/users/update-user/updateUser";
import { User } from "../../data/types/user";

export default function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUser = await fetchUser(id);
        if (fetchedUser) {
          setUser(fetchedUser);
          setName(fetchedUser.name);
          setEmail(fetchedUser.email);
          setPassword(fetchedUser.password || "");
          setRole(fetchedUser.role);
          setImageUrl(fetchedUser.image_url);
        }
      } catch (error) {
        console.error("Error fetching user:", (error as Error).message);
      }
    }

    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const imageUrl = URL.createObjectURL(selectedImage);
      setImageUrl(imageUrl);
    }
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     if (image) {
  //       // Upload or update user's image
  //       // You need to implement the logic to upload or update the user's image
  //       console.log("Upload or update user's image:", image);
  //     }

  //     await updateUser(id, name, email, password, role);
  //     console.log("User updated successfully!");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Error updating user:", (error as Error).message);
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (user && user.id) {
        const updatedUser: User = {
          ...user,
          id: user.id, // Ensure it's always defined
          name: name,
          email: email,
          password: password,
          role: role,
        };

        if (image) {
          // Upload or update user's image
          // You need to implement the logic to upload or update the user's image
          // console.log("Upload or update user's image:", image);

          // Call updateUser with the updated user object and the image file
          await updateUser(updatedUser, image);
        } else {
          // Call updateUser with only the updated user object
          await updateUser(updatedUser);
        }

        console.log("User updated successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating user:", (error as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="User" className="mb-4" />
          </div>
        )}
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
        <div>
          <label htmlFor="image" className="block mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
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
