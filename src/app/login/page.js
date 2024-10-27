"use client"; // Required for using hooks

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import styles from './styles.module.css'; // Adjust path if needed

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate successful login without checking credentials
    alert(`Logged in as: ${username}`);
    router.push('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.signupText}>
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;