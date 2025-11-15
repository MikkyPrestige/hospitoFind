import HospitalPic from "@/assets/images/hospital-logo.jpg";

export const Avatar = ({ image = "", alt = "", style = {} }) => {
  const handleError = (e: any) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = HospitalPic;
  };

  return (
    <img
      src={image || HospitalPic}
      alt={alt || "Hospital"}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
};



// export const Avatar = ({ image = "", alt = "", style = {} }) => {
//   return <img src={image} alt={alt} style={style} onError={ } />
// }