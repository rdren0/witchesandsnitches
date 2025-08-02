import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, User, Loader, AlertCircle, Check } from "lucide-react";

const OptimizedImageUpload = ({
  currentImageUrl = "",
  onImageChange,
  onUploadComplete,
  supabase,
  disabled = false,
  maxSizeMB = 5,
  compressionQuality = 0.8,
  maxWidth = 800,
  maxHeight = 800,
  bucket = "character-images",
  folder = "",
  placeholder = "Upload a character portrait",
  helpText = "JPG, PNG, GIF, or WebP • Will be compressed automatically",
  theme,
  styles = {},
  size = 150,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const uploadControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const compressImage = useCallback(
    (file, quality = 0.8, maxWidth = 800, maxHeight = 800) => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(resolve, file.type, quality);
        };

        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const validateFile = useCallback(
    (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please upload a valid image file (JPG, PNG, GIF, or WebP)"
        );
      }

      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`Image must be smaller than ${maxSizeMB}MB`);
      }

      return true;
    },
    [maxSizeMB]
  );

  const uploadToSupabase = useCallback(
    async (file) => {
      const fileExt = file?.name?.split(".").pop().toLowerCase();
      const fileName = `${
        folder ? folder + "/" : ""
      }${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      uploadControllerRef.current = new AbortController();

      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        if (!urlData?.publicUrl) {
          throw new Error("Failed to get public URL for uploaded image");
        }

        return urlData.publicUrl;
      } catch (error) {
        if (error.name === "AbortError") {
          throw new Error("Upload cancelled");
        }
        throw error;
      }
    },
    [bucket, folder, supabase]
  );

  const handleFileSelect = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      setError(null);
      setUploadSuccess(false);

      try {
        validateFile(file);

        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }

        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);

        if (onImageChange) {
          onImageChange(file, newPreviewUrl);
        }

        setIsUploading(true);
        setUploadProgress(0);

        setUploadProgress(20);

        let fileToUpload = file;
        if (file.type !== "image/gif") {
          fileToUpload = await compressImage(
            file,
            compressionQuality,
            maxWidth,
            maxHeight
          );
          setUploadProgress(40);
        }

        setUploadProgress(60);
        const uploadedUrl = await uploadToSupabase(fileToUpload);
        setUploadProgress(100);

        setUploadSuccess(true);

        if (onUploadComplete) {
          onUploadComplete(uploadedUrl);
        }
      } catch (err) {
        console.error("Error handling file:", err);
        setError(err.message);

        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }

        if (onImageChange) {
          onImageChange(null, null);
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        uploadControllerRef.current = null;

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [
      previewUrl,
      validateFile,
      compressImage,
      compressionQuality,
      maxWidth,
      maxHeight,
      uploadToSupabase,
      onImageChange,
      onUploadComplete,
    ]
  );

  const cancelUpload = useCallback(() => {
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort();
    }
  }, []);

  const removeImage = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    setUploadSuccess(false);

    if (onImageChange) {
      onImageChange(null, null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, onImageChange]);

  const displayImageUrl = previewUrl || currentImageUrl;
  const hasImage = !!displayImageUrl;

  const containerStyle = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    border: `3px dashed ${
      hasImage ? theme?.primary || "#3b82f6" : theme?.border || "#d1d5db"
    }`,
    backgroundColor: hasImage
      ? "transparent"
      : theme?.backgroundSecondary || "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled || isUploading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    margin: "0 auto",
    overflow: "hidden",
    opacity: disabled ? 0.6 : 1,
    ...styles.container,
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    opacity: isUploading ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  const progressStyle = {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    color: theme?.primary || "#3b82f6",
  };

  return (
    <div style={{ textAlign: "center", ...styles.wrapper }}>
      <div style={containerStyle}>
        {hasImage && (
          <img
            src={displayImageUrl}
            alt="Character preview"
            style={imageStyle}
          />
        )}

        <div style={overlayStyle}>
          {isUploading ? (
            <div style={{ textAlign: "center", color: "white" }}>
              <Loader
                size={24}
                style={{
                  marginBottom: "8px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <div style={{ fontSize: "12px" }}>
                {uploadProgress < 40
                  ? "Compressing..."
                  : uploadProgress < 80
                  ? "Uploading..."
                  : "Finishing..."}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: theme?.textSecondary || "#6b7280",
              }}
            >
              {hasImage ? (
                <Upload size={24} style={{ color: "white" }} />
              ) : (
                <>
                  <User
                    size={size > 120 ? 48 : 32}
                    style={{ marginBottom: "8px" }}
                  />
                  <Upload size={size > 120 ? 24 : 16} />
                </>
              )}
            </div>
          )}
        </div>

        {isUploading && uploadProgress > 0 && (
          <div style={progressStyle}>{uploadProgress}%</div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: disabled || isUploading ? "not-allowed" : "pointer",
          }}
        />

        {hasImage && !isUploading && (
          <button
            onClick={removeImage}
            disabled={disabled}
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              zIndex: 10,
            }}
          >
            <X size={12} />
          </button>
        )}

        {isUploading && (
          <button
            onClick={cancelUpload}
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              zIndex: 10,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: theme?.text || "#374151",
          ...styles.helpText,
        }}
      >
        {hasImage ? (
          <div>
            {uploadSuccess ? (
              <div
                style={{
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Check size={16} />
                Upload successful!
              </div>
            ) : previewUrl ? (
              "📷 New image selected - uploading automatically"
            ) : (
              "Click to upload a new image or click X to remove"
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: "500", marginBottom: "4px" }}>
              {placeholder}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme?.textSecondary || "#6b7280",
              }}
            >
              {helpText}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            ...styles.error,
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default OptimizedImageUpload;
