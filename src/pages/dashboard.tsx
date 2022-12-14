import { useContext, useEffect } from "react"
import { Can } from "../components/Can";

import { AuthContext } from "../contexts/AuthContext"
import { withSSRAuth } from "../utils/withSSRAuth";

import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";

export default function Dashboard(){
  const { user, signOut } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me').then(response => console.log(response.data))
      .catch(() => {
        signOut()
      })
  }, [])

  return(
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut} >SignOut</button>
      <Can permissions={['metrics.list']}>
        <div>Metrics</div>
      </Can>
    </>
  )
}

export const getServerSideProps = withSSRAuth( async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me')

  //console.log(response.data)
  return{
    props: {}
  }
})