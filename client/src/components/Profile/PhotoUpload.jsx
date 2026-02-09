import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function PhotoUpload({ currentPhoto, onUploaded, type = 'profile-photo' }) {
  const { t } = useTranslation();
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await axios.post(`/api/uploads/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(data.filename);
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  };

  const photoUrl = preview || (currentPhoto ? `/api/uploads/${currentPhoto}` : null);

  return (
    <div className="photo-upload">
      <div className="photo-preview" onClick={() => fileRef.current?.click()}>
        {photoUrl ? (
          <img src={photoUrl} alt="photo" />
        ) : (
          <span className="photo-placeholder">+</span>
        )}
        {uploading && <div className="photo-uploading"><span className="spinner-sm"></span></div>}
      </div>
      <button type="button" className="btn btn-sm" onClick={() => fileRef.current?.click()}>
        {currentPhoto ? t('profile.change_photo') : t('profile.upload_photo')}
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </div>
  );
}
