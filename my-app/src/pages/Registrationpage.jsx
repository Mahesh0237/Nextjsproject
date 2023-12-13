import { Button, Card, Container, LoadingOverlay, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import axios from 'axios'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import validator from 'validator'

function Registrationpage() {
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
    const [confirmPassword, setConfirmpassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const updateConfirmPassword = (e) => {
        setConfirmpassword(e.currentTarget.value)
        setConfirmPasswordError('')
    }

    useEffect(() => {

        const token = localStorage.getItem('token')
        if (token) {
            router.push('/Dashboardpage')
            setIsLoadingoverlayEffect(true)
        } else {
            router.push('/Registrationpage')
        }
    }, [])

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
        if (confirmPassword === '') {
            setConfirmPasswordError('enter the paswword')
            setIsLoadingoverlayEffect(false)
            return false
        }
        if (!(password === confirmPassword)) {
            setConfirmPasswordError('password is not matching')
            setIsLoadingoverlayEffect(false)
            return false
        }

        axios.post('http://127.0.0.1:8000/register/addnew', {
            email: email,
            password: password
        }, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
            .then((res) => {
                router.push('/Usercreated')
                console.log("data", res.data)
                setIsLoadingoverlayEffect(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoadingoverlayEffect(false)
            })
    }
    return (
        <Container>
            <Text size={20} align='center' style={{ textDecoration: "underline" }} color='teal' weight="bold" mb="md">Registration page </Text>
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
                    <PasswordInput
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        withAsterisk
                        value={confirmPassword}
                        error={confirmPasswordError}
                        onChange={updateConfirmPassword}
                    />
                    <Button fullWidth color="teal" onClick={updateLogindetails}>Create user</Button>
                </Stack>
                <LoadingOverlay visible={isLoadingoverlayEffect} />
            </Card>
        </Container>
    )
}

export default Registrationpage