
import styles from './TutorialPage.module.css';
import NavBar from '../component/common/NavBar';


function TutorialPage() {
    return(
        <div className={styles.container}>
            {/* <NavBar /> */}
            <div className={styles.content}>
                <h1>튜토리얼 페이지</h1>
            </div>

            <div> 
                <img
                className={styles.image}
                src="https://via.placeholder.com/700x200"  // Placeholder image URL
                alt="main"
                />
            </div>

        </div>
    )
}

export default TutorialPage;