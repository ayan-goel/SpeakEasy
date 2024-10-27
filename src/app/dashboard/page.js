'use client';

import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Navigate to the model page
    router.push('/model');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Welcome to the Dashboard!</h2>
        <div className={styles.buttonContainer}>
          {['Recruiter', 'Elders', 'Crush', 'Consoling Someone'].map((label) => (
            <button
              key={label}
              className={styles.largeButton}
              onClick={handleButtonClick}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;