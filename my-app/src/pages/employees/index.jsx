import { Card, Container, TextInput, Button, LoadingOverlay, Select, NumberInput, Group, Grid, Text, Notification, FileInput } from '@mantine/core'
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
function index() {
    const router = useRouter();
    const [loadingoverlayEffect, setLoadingoverlayEffect] = useState(false)
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
    }
    const [phonecode, setPhoneCode] = useState(null)
    const [phonecodeError, setPhoneCodeError] = useState('')
    const updatePhonecode = (value) => {
        setPhoneCode(value)
        setPhoneCodeError('')
    }
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [phoneNumberError, setPhoneNumberError] = useState('')
    const updatePhoneNumber = (value) => {
        setPhoneNumber(value)
        setPhoneNumberError('')
    }
    const [resumefile, setResumefile] = useState(null)
    const [resumefileError, setResumefileError] = useState('')
    const updateResumefile = (value) => {
        setResumefile(value)
        setResumefileError('')
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
        if (phonecode === null) {
            setPhoneCodeError('select the phone code')
            setLoadingoverlayEffect(false)
            return false
        }
        if (phoneNumber === null) {
            setPhoneNumberError('enter the phone number')
            setLoadingoverlayEffect(false)
            return false
        }
        if (resumefile === null) {
            setResumefileError('select your resume')
            setLoadingoverlayEffect(false)
            return false
        }

        // const formData = new FormData()

        // formData.append('firstname', firstname)
        // formData.append('lastname', lastName)
        // formData.append('email', email)
        // formData.append('phonecode', phonecode)
        // formData.append('phonenumber', phoneNumber)
        // formData.append('file', resumefile )

        axios.post('http://127.0.0.1:8000/employees/addnew', {

            firstname: firstname,
            lastname: lastName,
            email: email,
            phonecode: phonecode,
            phonenumber: phoneNumber,
            resume: resumefile
        }, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
            .then((res) => {
                router.push('/employees/Employeesdata');
                setLoadingoverlayEffect(false)
            })
            .catch((err) => {
                setLoadingoverlayEffect(false)
                console.log("error at ", err)
            })
    }
    return (
        <Container>
            <Card withBorder mt="lg">
                <Card.Section withBorder py="sm" inheritPadding>
                    <Text size={20} weight={500}>Add Employee </Text>
                </Card.Section>
                <Card.Section withBorder py="sm" inheritPadding>
                    <Grid>
                        <Grid.Col sm={12} md={6} lg={6} xl={6}>
                            <TextInput
                                placeholder="first name"
                                label="first name"
                                withAsterisk
                                value={firstname}
                                error={firstnameError}
                                onChange={updateFirstName}
                            />
                        </Grid.Col>
                        <Grid.Col sm={12} md={6} lg={6} xl={6}>
                            <TextInput
                                placeholder="last name"
                                label="last name"
                                withAsterisk
                                value={lastName}
                                error={lastnameError}
                                onChange={updateLastName}
                            />
                        </Grid.Col>
                        <Grid.Col sm={12} md={6} lg={6} xl={6}>
                            <TextInput
                                placeholder="email"
                                label="email"
                                withAsterisk
                                value={email}
                                error={emailError}
                                onChange={updateEmail}
                            />
                        </Grid.Col>
                        <Grid.Col sm={12} md={6} lg={6} xl={6}>
                            <Group grow>
                                <Select
                                    label="Phone Number"
                                    placeholder="select the phone code"
                                    withAsterisk
                                    value={phonecode}
                                    error={phonecodeError}
                                    onChange={updatePhonecode}
                                    data={[
                                        { value: '+91', label: '+91' },
                                        { value: '+81', label: '+81' },
                                        { value: '+51', label: '+51' },
                                        { value: '+91', label: '+91' },
                                    ]}
                                />
                                <NumberInput
                                    label=" "
                                    placeholder="enter your number"
                                    hideControls
                                    value={phoneNumber}
                                    error={phoneNumberError}
                                    onChange={updatePhoneNumber}
                                />
                            </Group>
                        </Grid.Col>
                        <Grid.Col sm={12} md={12} lg={12} xl={12}>
                            <FileInput
                                placeholder="Pick file"
                                label="Your resume"
                                withAsterisk
                                value={resumefile}
                                error={resumefileError}
                                onChange={updateResumefile}
                            />
                        </Grid.Col>
                    </Grid>
                </Card.Section>
                <Card.Section withBorder py="sm" inheritPadding>
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={updateLoginDetails}>submit</Button>
                </Card.Section>
            </Card>
            <LoadingOverlay visible={loadingoverlayEffect} />
        </Container>
    )
}

export default index




// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     firstname: '',
//     lastname: '',
//     email: '',
//     phonecode: '',
//     phonenumber: ''
//   });

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   }

//   const handleChange = (e) => {
//     setFormData({...formData, [e.target.name]: e.target.value});
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { firstname, lastname, email, phonecode, phonenumber } = formData;

//     const formDataToSend = new FormData();
//     formDataToSend.append('firstname', firstname);
//     formDataToSend.append('lastname', lastname);
//     formDataToSend.append('email', email);
//     formDataToSend.append('phonecode', phonecode);
//     formDataToSend.append('phonenumber', phonenumber);
//     formDataToSend.append('resume', file);

//     try {
//       const response = await axios.post('http://localhost:8000/employees/addnew', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return (
//     <div>
//       <h1>Employee Form</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           First Name:
//           <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Last Name:
//           <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Email:
//           <input type="email" name="email" value={formData.email} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Phone Code:
//           <input type="text" name="phonecode" value={formData.phonecode} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Phone Number:
//           <input type="number" name="phonenumber" value={formData.phonenumber} onChange={handleChange} />
//         </label>
//         <br />
//         <label>
//           Resume:
//           <input type="file" onChange={handleFileChange} />
//         </label>
//         <br />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default App;
