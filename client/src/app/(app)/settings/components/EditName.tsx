"use client";

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Input } from "@/app/ui/Input";
import { Button } from "@/app/ui/Button";

export function EditName() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch user data when component mounts
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true, // Include cookies with the request
      });
      const userData = response.data.user;
      if (userData) {
        console.log("User data:", userData);

        setFullName(userData.name);
        setEmail(userData.email);
      } else {
        console.error("User data not found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Send updated user data to the server
      await axios.put(
        "http://localhost:5000/api/user",
        {
          name: fullName,
        },
        {
          withCredentials: true, // Include cookies with the request
        }
      );
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <form className="w-full max-w-sm items-center" onSubmit={handleSubmit}>
        <Input
          type="text"
          id="fullname"
          value={fullName} // Bind value to fullName state
          onChange={(e) => setFullName(e.target.value)} // Update fullName state on change
        />

        <div className="mt-4">
          <Input
            type="email"
            id="email"
            value={email} // Bind value to email state
            disabled // Disable email input
          />
        </div>
        <Button type="submit" variant="darkCTA" className="mt-4">
          Update
        </Button>
      </form>
    </>
  );
}
