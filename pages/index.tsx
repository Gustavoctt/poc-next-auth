import { useContext } from 'react';
import { useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, signIn  } = useContext(AuthContext)

  function handleSubmit(event){
    event.preventDefault();
    const data = {
      email,
      password
    }

    signIn(data)
  }

  return (
    <div className={styles.container}>
      <form  onSubmit={handleSubmit} className={styles.main}>
        <h2>SignIn</h2>
        <input type="email" value={email} onChange={ e => setEmail(e.target.value) }/>
        <input type="password" value={password} onChange={ e => setPassword(e.target.value) }/>
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}
