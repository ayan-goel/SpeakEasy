"use client";

import styles from './styles.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SpeakEasy</h1>
      <p className={styles.description}>
        SpeakEasy empowers you to navigate difficult conversations with confidence. 
        Whether you're preparing to talk to a recruiter, console a friend, or tackle 
        any sensitive topic, our AI-driven simulations provide personalized feedback 
        to help you improve your communication skills.
      </p>
      <div className={styles.buttonContainer}>
        <a href="/login" className={styles.button}>Get Started</a>
      </div>
    </div>
  );
};

export default HomePage;
