import { Card, Table, Container, TextInput, Stack, Button, LoadingOverlay, Text, Notification } from '@mantine/core'
import { IconX } from '@tabler/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
function index() {
  const [userdata, setUserdata] = useState([])
  useEffect(() => {
    getApi();
  }, [])
  const getApi = () => {
    axios.get('http://127.0.0.1:8000/userstwo')
      .then((res) => {
        let data = res.data
        setUserdata(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const [loadingoverlayEffect, setLoadingoverlayEffect] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [firstname, setFirstname] = useState('')
  const [firstnameError, setFirstnameError] = useState('')
  const updateFirstName = (e) => {
    setFirstname(e.currentTarget.value)
    setFirstnameError('')
  }
  const [lastName, setLastName] = useState('')
  const [lastnameError, setLastnameError] = useState('')
  const updateLastName = (e) => {
    setLastName(e.currentTarget.value)
    setLastnameError('')
  }
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const updateEmail = (e) => {
    setEmail(e.currentTarget.value)
    setEmailError('')
    setErrorMessage('')
  }


  const updateLoginDetails = () => {
    setLoadingoverlayEffect(true)
    if (firstname === '') {
      setFirstnameError('enter the first name')
      setLoadingoverlayEffect(false)
      return false
    }
    if (lastName === '') {
      setLastnameError('enter the last name')
      setLoadingoverlayEffect(false)
      return false
    }
    if (email === '') {
      setEmailError('enter the email')
      setLoadingoverlayEffect(false)
      return false
    }
    axios.post('http://127.0.0.1:8000/userstwo/addnew', {
      first_name: firstname,
      last_name: lastName,
      email: email
    })
      .then((res) => {
        getApi();
        setFirstname('');
        setLastName('');
        setEmail('');
        setLoadingoverlayEffect(false)
      })
      .catch((err) => {
        setErrorMessage(err.response.data.detail);
        setLoadingoverlayEffect(false)
      })

  }
  return (
    <Container>
      <Table withBorder>
        <thead>
          <tr>
            <th>id</th>
            <th>First anme</th>
            <th>last name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {
            userdata.length != 0 &&
            userdata.map((user, index) =>
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
      <Card withBorder mt="lg">
        <Stack>
          <TextInput
            placeholder="firstname"
            label="first name"
            withAsterisk
            value={firstname}
            error={firstnameError}
            onChange={updateFirstName}
          />
          <TextInput
            placeholder="lastname"
            label="lastname"
            withAsterisk
            value={lastName}
            error={lastnameError}
            onChange={updateLastName}
          />
          <TextInput
            placeholder="email"
            label="email"
            withAsterisk
            value={email}
            error={emailError}
            onChange={updateEmail}
          />
          {errorMessage &&
            <Notification icon={<IconX size="1.1rem" />} color="red" withCloseButton={false} my="xs">
              invalid email
            </Notification>
          }
          <Button variant='default' fullWidth={true} onClick={updateLoginDetails}>submit</Button>
        </Stack>
      </Card>
      <LoadingOverlay visible={loadingoverlayEffect} />
    </Container>
  )
}

export default index