"use client"; // Required for using hooks

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import styles from './styles.module.css'; // Adjust path if needed

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router for navigation

  const handleSignUp = (e) => {
    e.preventDefault();
    // Directly redirect to dashboard without backend logic
    router.push('/dashboard'); // Redirect to dashboard.js
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>
      <form onSubmit={handleSignUp} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
      <p className={styles.loginText}>
        Already have an account? <Link href="/">Login</Link>
      </p>
    </div>
  );
};

export default SignUpPage;