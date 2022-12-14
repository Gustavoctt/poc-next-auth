import { useContext, useState } from 'react';

import { GetServerSideProps } from 'next';
import { AuthContext } from '../contexts/AuthContext';

import styles from '../styles/Home.module.css'
import { parseCookies } from 'nookies';
import { withSSRGuest } from '../utils/withSSRGuest';

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

// Recupera o cookie do contexto e se já tiver, manda direto para o dashboard
export const getServerSideProps = withSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})
