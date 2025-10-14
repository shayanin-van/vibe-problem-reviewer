import styles from "./ShowButton.module.css";

function ShowButton({ onClick }) {
  return (
    <div className={styles.showButton}>
      <button onClick={onClick}>→</button>
    </div>
  );
}

export default ShowButton;
