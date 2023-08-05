
import styles from './TutorialPage.module.css';



function TutorialPage() {
    return(
        <div className={styles.container}>
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