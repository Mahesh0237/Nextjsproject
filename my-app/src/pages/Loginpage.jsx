import { Button, Card, Container, LoadingOverlay, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import validator from 'validator'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
function Loginpage() {
    const router = useRouter()
    const [isLoadingoverlayEffect, setIsLoadingoverlayEffect] = useState(false)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const updateEmail = (e) => {
        setEmail(e.currentTarget.value)
        setEmailError('')
    }
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const updatePassword = (e) => {
        setPassword(e.currentTarget.value)
        setPasswordError('')
    }

    const updateLogindetails = () => {
        setIsLoadingoverlayEffect(true)
        if (email === '') {
            setEmailError('enter the email')
            setIsLoadingoverlayEffect(false)
            return false
        }
        if (validator.isEmail(email) === false) {
            setEmailError('enter a valid email address')
            setIsLoadingoverlayEffect(false)
            return false
        }
        if (password === '') {
            setPasswordError('enter the password')
            setIsLoadingoverlayEffect(false)
            return false
        }

        axios.post('http://127.0.0.1:8000/login/validate', {
            email: email,
            password: password
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((res) => {
                const { access_token } = res.data;
                localStorage.setItem('token', access_token);
                console.log('token', access_token)
                setIsLoadingoverlayEffect(false)
                router.push('/Dashboardpage')
            })
            .catch((error) => {
                if (error.response.data.detail === 'Invalid password') {
                    setPasswordError('Incorrect password')
                } else if (error.response.status === 401) {
                    setEmailError('User not registered')
                } else {
                    console.log(error)
                }
                setIsLoadingoverlayEffect(false)
            })
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            router.push('/Dashboardpage')
            setIsLoadingoverlayEffect(true)
        } else{
            router.push('/Loginpage')
        }
    }, [])
   
    return  (
        <Container>
            <Text size={20} weight="bold" color="teal" align='center' mb="md" style={{ textDecoration: "underline" }}>Login page</Text>
            <Card withBorder>
                <Stack>
                    <TextInput
                        placeholder='enter your email'
                        label="Email"
                        withAsterisk
                        value={email}
                        error={emailError}
                        onChange={updateEmail}
                    />
                    <PasswordInput
                        placeholder="Password"
                        label="Password"
                        withAsterisk
                        value={password}
                        error={passwordError}
                        onChange={updatePassword}
                    />
                    <Button fullWidth color="teal" onClick={updateLogindetails}>Login</Button>
                    <Link href="/Registrationpage">click here to register?</Link>
                </Stack>
                <LoadingOverlay visible={isLoadingoverlayEffect} />
            </Card>
        </Container>
    )
}

export default Loginpage