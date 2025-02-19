import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile ,updateProfile, uploadAvatar } from "../../store/slices/profileSlice";

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarPreview(profile.avatar || "");
    }
  }, [profile]);

  // ✅ Handle image upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle profile update
  const handleUpdate = () => {
    dispatch(updateProfile({ name, phone }));
  };

  // ✅ Handle avatar upload
  const handleAvatarUpload = () => {
    if (avatar) {
      dispatch(uploadAvatar(avatar));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="mb-4 text-center">
            <img
              src={avatarPreview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <input type="file" onChange={handleAvatarChange} className="mt-2" />
            <button onClick={handleAvatarUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Upload Avatar</button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button onClick={handleUpdate} className="w-full bg-green-500 text-white py-2 rounded">Update Profile</button>
        </>
      )}
    </div>
  );
};

export default ProfileUpdate;
