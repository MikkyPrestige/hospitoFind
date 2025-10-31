import { Avatar } from "./avatar"
// import Treatment from "@/assets/images/treatment.jpg";
import Treatment from "@/assets/images/hospital2.jpg";
import style from "./style/bg.module.css";

export const BG = () => {
  return (
    <>
      <div className={style.bg}>{""}</div>
      <section className={style.container}>
        <div className={style.content}>
          <h1 className={style.header}>HospitoFind</h1>
          <h2 className={style.subhead}>Connecting You to Quality Healthcare</h2>
          <p className={style.text}>Find, share, and connect with trusted hospitals dedicated to better care for everyone.</p>
        </div>
        <div className={style.img}>
          <Avatar image={Treatment} alt="Treatment" style={{ width: "100%", height: "100%", borderRadius: "1rem", objectFit: "cover" }} />
        </div>
      </section>
    </>
  )
}