import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Home, MoveLeft } from "lucide-react";
import Error404 from "@/assets/images/error-404.gif";
import styles from "./styles/error404.module.scss";

const Error404Page = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | HospitoFind</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={styles.content}
        >
          <img
            src={Error404}
            alt="Page not found illustration"
            className={styles.illustration}
          />

          <h1 className={styles.title}>Lost in the clouds?</h1>

          <p className={styles.text}>
            Oops! The page you're looking for doesn't exist.
            It might have been moved, deleted, or perhaps it never existed in the first place.
          </p>

          <Link to="/" className={styles.homeBtn}>
            <Home size={20} />
            Back to Homepage
          </Link>

          <Link to={-1 as any} className={styles.backBtn}>
            <MoveLeft size={16} /> Go Back
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default Error404Page;