"use client"
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faXTwitter, 
    faFacebook, 
    faTelegram, 
    faDiscord, 
    faYoutube, 
    faGithub, 
    faMedium 
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe as faGlobeSolid } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return(
        <footer className={styles.footer}>
            <div className={styles.footer__container}>
                <div className={styles.footer__copyright}>
                    © Copyright 2024
                </div>
                <div className={styles.footer__links}>
                    <a href="https://iconicink.com/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGlobeSolid} /> Website
                    </a>
                    <a href="https://x.com/iconicink" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faXTwitter} /> 
                    </a>
                    <a href="https://www.facebook.com/iconicink/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} /> Facebook
                    </a>
                    <a href="https://www.facebook.com/iconicink/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTelegram} /> Telegram
                    </a>
                    <a href="https://discord.com/invite/iconicink" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faDiscord} /> Discord
                    </a>
                    <a href="https://www.youtube.com/iconicink" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faYoutube} /> YouTube
                    </a>
                    <a href="https://github.com/iconicink" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} /> GitHub
                    </a>
                    <a href="https://medium.com/iconicink" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faMedium} /> Medium
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;