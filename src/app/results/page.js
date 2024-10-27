'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './results.module.css';

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processedText, setProcessedText] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  // Pre-process the text to replace **bold** with <strong>bold</strong>
  const formatText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  useEffect(() => {
    const text = searchParams.get('comparisonResult');
    if (text) {
      setProcessedText(formatText(text));  // Apply formatting on initial load
    }
  }, [searchParams]);

  useEffect(() => {
    let timeoutId;

    if (processedText) {
      let index = 0;

      const typeCharacter = () => {
        if (index < processedText.length) {
          const char = processedText[index];
          setDisplayedText((prev) => `${prev}${char}`);
          index++;
          timeoutId = setTimeout(typeCharacter, 10); // Adjust speed for typing effect
        }
      };

      typeCharacter(); // Start typing effect

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [processedText]);

  // Button to navigate back to the original page
  const handleBack = () => {
    router.push('/');
  };

  // Button to close the current tab
  const handleClose = () => {
    window.close();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Let's see how you can improve.</h1>
        
        {/* Render the processed text with HTML formatting */}
        <p dangerouslySetInnerHTML={{ __html: displayedText || "No data received" }} />

        <div className={styles.buttonContainer}>
          <button onClick={handleBack} className={styles.button}>Back to Home</button>
          <button onClick={handleClose} className={styles.button}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;