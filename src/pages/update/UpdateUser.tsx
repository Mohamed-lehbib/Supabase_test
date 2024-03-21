import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser } from "../../queries/users/get-user-by-id/fetchUser";
import { updateUser } from "../../queries/users/update-user/updateUser";

import { User } from "../../data/types/user";
import { uploadUserImage } from "../../queries/users/upload-user-image/uploadUserImage";

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

  // State variables for files and file previews
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  // const [filePreviews, setFilePreviews] = useState<(string | ArrayBuffer)[]>(
  //   []
  // );
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [addedFiles, setAddedFiles] = useState<File[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<
    { file_id: string; file_name: string }[]
  >([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const fetchedUser = await fetchUser(id);
  //       if (fetchedUser) {
  //         setUser(fetchedUser);
  //         setName(fetchedUser.name);
  //         setEmail(fetchedUser.email);
  //         setPassword(fetchedUser.password || "");
  //         setRole(fetchedUser.role);
  //         setImageUrl(fetchedUser.image_url);
  //         // Set file previews if user has files
  //         if (fetchedUser.files_url && fetchedUser.files_url.length > 0) {
  //           setFilePreviews(fetchedUser.files_url.map((file) => file));
  //           console.log(filePreviews);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", (error as Error).message);
  //     }
  //   }

  //   fetchData();
  // }, [id]);
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

          // Assuming fetchedUser includes files_url and file_names
          setFilePreviews(fetchedUser.files_url || []);
          setFileNames(fetchedUser.file_names || []);
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

  // Function to handle file selection
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const selectedFiles = Array.from(e.target.files);

  //     // Append new files to existing files
  //     const updatedFiles = [...files, ...selectedFiles];
  //     setFiles(updatedFiles);

  //     // Create and append previews for new selected files
  //     const newPreviews = selectedFiles.map((file) =>
  //       URL.createObjectURL(file)
  //     );
  //     const updatedPreviews = [...filePreviews, ...newPreviews];
  //     setFilePreviews(updatedPreviews);

  //     // Update and append file names
  //     const newNames = selectedFiles.map((file) => file.name);
  //     const updatedNames = [...fileNames, ...newNames];
  //     setFileNames(updatedNames);
  //   }
  // };

  // // Function to remove a file
  // const removeFile = (index: number) => {
  //   const updatedFiles = [...files];
  //   updatedFiles.splice(index, 1);
  //   setFiles(updatedFiles);

  //   const updatedPreviews = [...filePreviews];
  //   updatedPreviews.splice(index, 1);
  //   setFilePreviews(updatedPreviews);

  //   // Also remove the file name from the list
  //   const updatedFileNames = [...fileNames];
  //   updatedFileNames.splice(index, 1);
  //   setFileNames(updatedFileNames); // This ensures file names are in sync with the files
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles] as File[]); // Ensure the return type is explicitly File[]
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file as Blob)
      ); // Ensure the argument for URL.createObjectURL is typed
      setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      const newNames = selectedFiles.map((file) => file.name);
      setFileNames((prevNames) => [...prevNames, ...newNames]);
      setAddedFiles(
        (prevAddedFiles) => [...prevAddedFiles, ...selectedFiles] as File[]
      ); // Ensure the return type is explicitly File[]
    }
  };

  const removeFile = (index: number) => {
    // Directly remove the file object from the files array
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    // Remove the corresponding preview
    const updatedPreviews = [...filePreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up the object URL
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);

    // Remove the corresponding file name
    const updatedFileNames = [...fileNames];
    updatedFileNames.splice(index, 1);
    setFileNames(updatedFileNames);

    // Assuming user.files contains IDs that correspond by index to the files in the `files` array
    // Check if the file to be removed has a corresponding ID in user.files
    if (user && user.files && index < user.files.length) {
      const fileIdToRemove = user.files[index];

      // Assuming fileIdToRemove is the ID string you need
      const removedFile = {
        file_id: fileIdToRemove, // Use the ID from user.files
        file_name: fileNames[index], // Use the name from the fileNames array for reference
      };
      setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, removedFile]);

      // Optionally, if you need to also update user.files to reflect the removal
      // This step depends on how you want to handle this state and when it gets synced with the server
      const updatedUserFiles = user.files.filter((_, idx) => idx !== index);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, files: updatedUserFiles } : null
      );
    }
  };

  // Function to handle form submission
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

        // Upload or update user's image
        if (image) {
          console.log(`added Image: ${addedFiles}`);
          console.log(addedFiles);
          // Call updateUser with the updated user object and the image file
          await updateUser(updatedUser, addedFiles, deletedFiles, image);
        } else {
          // Call updateUser with only the updated user object
          console.log(`added Image: ${addedFiles}`);
          console.log(addedFiles);
          await updateUser(updatedUser, addedFiles, deletedFiles);
        }

        // Upload or update user's files
        // if (files.length > 0) {
        //   // Upload files and get their URLs
        //   const fileUrls = await Promise.all(
        //     files.map((file) => uploadUserImage(file))
        //   );
        // // Add file URLs to user object
        // updatedUser.files = fileUrls.map((url, index) => ({
        //   name: files[index].name,
        //   url: url || "", // Ensure the URL is not null
        // }));
        // Call updateUser with the updated user object
        // await updateUser(updatedUser);
        // }

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
        <div className="mb-4 relative">
          {imageUrl ? (
            <div className="mb-4">
              {/* Image with imageUrl */}
              <img
                src={imageUrl}
                alt="User"
                className="object-cover w-96 h-96"
              />
            </div>
          ) : (
            <div className="mb-4">
              {/* Default image if imageUrl is not available */}
              <img
                src="images/default-avatar.jpg"
                alt="User"
                className="object-cover w-96 h-96"
              />
            </div>
          )}
          <div className="absolute top-0 right-0">
            <label
              htmlFor="image"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              Add Image
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageUrl && (
              <button
                onClick={() => {
                  setImage(null);
                  setImageUrl(undefined);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md ml-2"
              >
                Delete Image
              </button>
            )}
          </div>
        </div>
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
        {/* <div>
          <label htmlFor="image" className="block mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div> */}
        {/* <div>
          <label htmlFor="files" className="block mb-1">
            Files
          </label>
          <input
            type="file"
            id="files"
            onChange={handleFileChange}
            multiple
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          {filePreviews.map((preview, index) => (
            <div key={index} className="mt-2 flex items-center">
              <div className="w-10 h-10 bg-gray-200 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={preview as string}
                  alt="File Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p>{files[index].name}</p>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div> */}
        <div>
          <label htmlFor="files" className="block mb-1">
            Files
          </label>
          <input
            type="file"
            id="files"
            onChange={handleFileChange}
            multiple
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <div className="mt-2 space-y-2">
            {filePreviews.map((preview, index) => (
              <div key={index} className="flex items-center">
                <div className="ml-3 flex-grow">
                  {/* Here we replace the img tag with an a tag */}
                  <a
                    href={preview as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {fileNames[index]}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
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
