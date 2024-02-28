import { useState, useEffect } from "react";
import {
  Card,
  Skeleton,
  Avatar,
  Button,
  Input,
  Typography,
  message,
} from "antd";
import axios from "axios";

const { Meta } = Card;
const { Title } = Typography;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditButtonClick = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    console.log(profileData);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${process.env.API_URL}/user/update-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      message.error("Failed to update profile. Please try again later.");
    }
  };

  return (
    <div className='profile-page flex justify-center items-center w-full h-full'>
      <div className='w-full max-w-4xl h-full'>
        <Card
          className='profile-card p-8'
          title={
            <Title
              level={4}
              className='text-lg md:text-xl lg:text-2xl xl:text-3xl'
            >
              User Information
            </Title>
          }
        >
          {loading ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <div className='avatar-container text-center mb-4'>
                <Avatar size={60} src={profileData.avatar}>
                  {profileData.firstName &&
                    profileData.firstName.charAt(0).toUpperCase()}
                  {profileData.lastName &&
                    profileData.lastName.charAt(0).toUpperCase()}
                </Avatar>
                <p className='mt-2 text-lg'>
                  Account Number: {profileData._id}
                </p>
              </div>
              <Meta
                description={
                  <>
                    <div className='profile-field mb-2'>
                      <label className='text-lg'>First Name:</label>
                      <Input
                        value={profileData.firstName}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div className='profile-field mb-2'>
                      <label className='text-lg'>Last Name:</label>
                      <Input
                        value={profileData.lastName}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                    <div className='profile-field mb-2'>
                      <label className='text-lg'>Username:</label>
                      <Input
                        value={profileData.username}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                      />
                    </div>
                    <div className='profile-field mb-2'>
                      <label className='text-lg'>Password:</label>
                      <Input.Password
                        value={profileData.password}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>
                    <div className='profile-field mb-2'>
                      <label className='text-lg'>Security Code:</label>
                      <Input
                        value={profileData.code}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("code", e.target.value)
                        }
                      />
                    </div>
                  </>
                }
              />
            </>
          )}
          {editMode && (
            <Button className='mt-4 mr-4' onClick={handleSaveChanges}>
              Save Changes
            </Button>
          )}
          <Button className='mt-4' onClick={handleEditButtonClick}>
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
