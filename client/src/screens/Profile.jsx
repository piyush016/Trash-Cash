import { useState, useEffect } from "react";
import {
  Card,
  Skeleton,
  Avatar,
  Button,
  Input,
  Typography,
  message,
  Divider,
} from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { tokenState } from "../atoms/userState";

const { Meta } = Card;
const { Title } = Typography;

const Profile = () => {
  const [tokenAtom, setTokenAtom] = useRecoilState(tokenState);
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
              Authorization: `Bearer ${tokenAtom}`,
            },
          }
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching profile data.");
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
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${process.env.API_URL}/user/update-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${tokenAtom}`,
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Profile
        </Title>
      </Divider>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card style={{ padding: "2rem" }}>
          {loading ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <Avatar size={60} src={profileData.avatar}>
                  {profileData.firstName &&
                    profileData.firstName.charAt(0).toUpperCase()}
                  {profileData.lastName &&
                    profileData.lastName.charAt(0).toUpperCase()}
                </Avatar>
                <p style={{ marginTop: "0.5rem", fontSize: "1.25rem" }}>
                  Account Number: {profileData._id}
                </p>
              </div>
              <Meta
                description={
                  <>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1.25rem" }}>First Name:</label>
                      <Input
                        value={profileData.firstName}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1.25rem" }}>Last Name:</label>
                      <Input
                        value={profileData.lastName}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1.25rem" }}>Username:</label>
                      <Input
                        value={profileData.username}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1.25rem" }}>Password:</label>
                      <Input.Password
                        value={profileData.password}
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1.25rem" }}>
                        Security Code:
                      </label>
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
            <Button
              style={{ marginTop: "1rem", marginRight: "0.5rem" }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          )}
          <Button style={{ marginTop: "1rem" }} onClick={handleEditButtonClick}>
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
