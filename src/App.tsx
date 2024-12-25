import React from 'react'
import AppRouter from './router/AppRouter'
import useAuth from './hooks/useAuth'
const App: React.FC = () => {
  const {  loading } = useAuth();
  if (loading) {
    return <div>Loading....</div>
  }
  return <>
    <AppRouter />
  </>

}

export default App