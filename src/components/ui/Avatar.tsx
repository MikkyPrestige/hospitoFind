import HospitalPic from "@/assets/images/hospital-logo.jpg";

interface AvatarProps {
  image?: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  image = "",
  alt = "",
  style = {},
  className = ""
}) => {
  const handleError = (e: any) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = HospitalPic;
  };

  return (
    <img
      src={image || HospitalPic}
      alt={alt || "HospitoFind"}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
};