// avatar component
export const Avatar = ({ image = "", alt = "", style = {} }) => {
  return <img src={image} alt={alt} style={style} />
}