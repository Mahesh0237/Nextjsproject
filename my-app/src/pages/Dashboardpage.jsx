import { Button, Container, LoadingOverlay, Text } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
function Dashboardpage() {
  const [isLoadingoverlayEffect, setIsLoadingoverlayEffect] = useState(false)
  const router = useRouter()
  const logoutPage = () => {
    localStorage.removeItem('token')
    router.push('/Loginpage')
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    setTimeout(() => {
      if (!token) {
        router.push('/Loginpage')
        setIsLoadingoxverlayEffect(true)
      } else{
        router.push('Dashboardpage')
      }
    }, 1000);
  }, [])

  return (
    <Container>
      <Text weight="bold" size={15}>This is the Dashboard page</Text>
      <Button onClick={logoutPage}>Logout</Button>
      <LoadingOverlay visible={isLoadingoverlayEffect}/>
    </Container>
  )
}

export default Dashboardpage