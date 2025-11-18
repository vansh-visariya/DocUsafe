"use client";

import { useState } from "react";
import { Save, User, Lock, Bell, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-provider";
import { useAuthStore } from "@/lib/store";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function StudentSettingsPage() {
  const { user } = useAuthContext();
  const { setUser } = useAuthStore();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    enrollmentNumber: user?.enrollmentNumber || "",
    course: user?.course || "",
    year: user?.year || 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  const handleProfileSave = async () => {
    try {
      const response = await updateProfileMutation.mutateAsync(profileData);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Success", "Profile updated successfully");
      }
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Error", "Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Success", "Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error("Error", error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            disabled={updateProfileMutation.isPending}
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            disabled={updateProfileMutation.isPending}
          />
          <Button onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <CardTitle>Academic Information</CardTitle>
          </div>
          <CardDescription>
            Update your enrollment and course details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Enrollment Number"
            value={profileData.enrollmentNumber}
            onChange={(e) =>
              setProfileData({ ...profileData, enrollmentNumber: e.target.value })
            }
            disabled={updateProfileMutation.isPending}
          />
          <Input
            label="Course"
            value={profileData.course}
            onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
            disabled={updateProfileMutation.isPending}
            placeholder="e.g., B.Tech Computer Science"
          />
          <Input
            label="Year"
            type="number"
            value={profileData.year.toString()}
            onChange={(e) => setProfileData({ ...profileData, year: parseInt(e.target.value) || 0 })}
            disabled={updateProfileMutation.isPending}
            placeholder="e.g., 1, 2, 3, or 4"
          />
          <Button onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            disabled={updatePasswordMutation.isPending}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            disabled={updatePasswordMutation.isPending}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
            disabled={updatePasswordMutation.isPending}
          />
          <Button onClick={handlePasswordChange} disabled={updatePasswordMutation.isPending}>
            <Lock className="mr-2 h-4 w-4" />
            {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification settings coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
