import styles from './Header.module.css';

const Header = (props) => {
    return (
        <div className={styles.content}>
            <h1>Using face-api in React to create live facial recognition with the webcam</h1>
            <p>Click the start button below and accept the permissions to begin the facial recognition.</p>
        </div>
    )
}

export default Header;