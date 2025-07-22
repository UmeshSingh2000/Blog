import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
    about: "",
    title: "",
    education: [] // array of strings
  });

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        about: userData.about || "",
        title: userData.title || "",
        education: userData.education || [],
        password: "",
        profilePicture: null,
      });
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data.");
    } finally {
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

  // ──────── Education: array of strings, not objects ────────
  // Add new education input
  const addEducationEntry = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, ""]
    }));
  };

  // Remove specific education
  const removeEducationEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Update specific education entry
  const handleEducationChange = (index, value) => {
    const updated = [...formData.education];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, education: updated }));
  };

  // Save education (API)
  const handleEducationUpdate = async () => {
    const valid = formData.education.map(e => e.trim()).filter(Boolean);
    if (valid.length === 0) {
      return toast.error("Please add at least one education entry.");
    }

    try {
      setLoading(true);
      const res = await axios.put(`${api}/updateEducation`, { education: valid }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        toast.success("Education saved");
        dispatch(setMydata(res.data.user));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update education");
    } finally {
      setLoading(false);
    }
  };
  // ──────────────────────────────────────────

  const handleProfilePictureUpdate = async () => {
    if (!formData.profilePicture) return toast.error("Please select a profile picture");
    const data = new FormData();
    data.append("profilePicture", formData.profilePicture);
    try {
      setLoading(true);
      const res = await axios.put(`${api}/updateProfilePicture`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Profile picture updated");
      dispatch(setMydata(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      email: formData.email,
      title: formData.title
    };
    if (formData.password) data.password = formData.password;
    try {
      setLoading(true);
      const res = await axios.put(`${api}/updateProfile`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Profile updated");
      dispatch(setMydata(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAboutUpdate = async () => {
    try {
      const res = await axios.put(`${api}/updateUserAbout`, { about: formData.about }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        toast.success("About updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update about");
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
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* —————————— Profile Picture —————————— */}
        <div className="flex justify-center items-center">
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

        {/* —————————— Account Info —————————— */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    type="text" 
                    placeholder="e.g., Software Engineer" 
                    value={formData.title} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password" 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  value={formData.password} 
                  onChange={handleChange} 
                />
              </div>
              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* —————————— About —————————— */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  placeholder="Describe yourself..."
                  value={formData.about}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                type="button"
                className="w-full mt-2"
                onClick={handleAboutUpdate}
              >
                Update About
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* —————————— Education (ARRAY OF STRINGS) —————————— */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Education</CardTitle>
            <Button type="button" onClick={addEducationEntry} variant="outline" size="sm">
              Add Entry
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {formData.education.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No education entries yet.</p>
                  <p className="text-sm">Click "Add Entry" above to get started.</p>
                </div>
              ) : (
                formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 relative bg-gray-50">
                    <Label>Education #{index + 1}</Label>
                    <Textarea
                      placeholder="Enter your full education (e.g., B.Tech, Delhi University, 2018–2022)"
                      value={edu}
                      onChange={(e) => handleEducationChange(index, e.target.value)}
                      rows={3}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeEducationEntry(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
              {formData.education.length > 0 && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleEducationUpdate}
                >
                  Save All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
