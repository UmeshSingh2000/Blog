import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMydata } from "@/Redux/Features/User/userSlice";
import defaultProfile from '../assets/default_User.png';
import VerifyPassword from "./VerifyPassword";
import Loader from "./Loader/Loader";

const api = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const userData = useSelector((state) => state.user.value);
  const isPasswordVerified = useSelector((state) => state.user.isPasswordVerified);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || ""
      }));
    } else {
      fetchMyData();
    }
  }, [userData]);

  const fetchMyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/getMyData`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.status === 200) {
        dispatch(setMydata(response.data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching data.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "profilePicture") {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleProfilePictureUpdate = async () => {
    if (!formData.profilePicture) {
      return toast.error("Please select a profile picture.");
    }
    const data = new FormData();
    data.append("profilePicture", formData.profilePicture);


    try {
      setLoading(true);
      const response = await axios.put(`${api}/updateProfilePicture`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Profile picture updated");
      dispatch(setMydata(response.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email,
    }
    if (formData.password) data.password = formData.password;
    try {
      setLoading(true);
      const response = await axios.put(`${api}/updateProfile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Profile updated successfully");
      dispatch(setMydata(response.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    finally {
      setLoading(false);
    }
  };

  if (!isPasswordVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <VerifyPassword />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Picture */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <img
              src={
                formData.profilePicture
                  ? URL.createObjectURL(formData.profilePicture)
                  : userData?.profilePicture || defaultProfile
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
              onChange={handleChange}
            />
          </div>
          <Button className="ml-4" onClick={handleProfilePictureUpdate}>
            Update
          </Button>
        </div>

        {/* Settings Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input id="name" type="text" value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full mt-4 cursor-pointer">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
