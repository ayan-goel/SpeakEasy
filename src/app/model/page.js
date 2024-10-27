'use client';
import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';

const SpeechToText = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [question, setQuestion] = useState(''); // State for the fetched question
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    // Fetch the generated question when the component mounts
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/model/api/generate-question');
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        setQuestion(data.question); // Store the question
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion(); // Call the function to fetch the question on mount
  }, []);

  if (!hasMounted) {
    return null;
  }

  const startListen = () => {
    SpeechRecognition.startListening({ continuous: true });
    setListening(true);
  };

  const stopListen = () => {
    SpeechRecognition.stopListening();
    setListening(false);
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting question and transcript:", question, transcript);
  
      // Send question and transcript to the Next.js API
      const response = await fetch('/model/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, transcript }), // Pass question and transcript
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Received processed data:", data); // Debugging log to verify data
  
      // Navigate to the results page with comparison result as query parameter
      if (data.comparisonResult) {
        router.push(`/results?comparisonResult=${encodeURIComponent(data.comparisonResult)}`);
      } else {
        console.error("No comparisonResult found in response");
      }
    } catch (error) {
      console.error('Error submitting question and transcript:', error);
    }
  };

  return (
    <div className="speech-to-text-container">
      <div className="video-container">
        <Webcam style={{ transform: "scaleX(-1)" }} audio={true} />
      </div>

      <div className="question-container">
        <h2>Generated Question:</h2>
        <p>{question || "Loading question..."}</p>
      </div>

      <div className="controls-container">
        <div className="controls">
          <button onClick={startListen} disabled={listening}>Start Listening</button>
          <button onClick={stopListen} disabled={!listening}>Stop Listening</button>
          <button onClick={resetTranscript}>Reset Transcript</button>
          <button onClick={handleSubmit}>Submit Transcript</button>
        </div>
        
        <div className="transcript">
          <h2>Transcript:</h2>
          <p>{transcript}</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;