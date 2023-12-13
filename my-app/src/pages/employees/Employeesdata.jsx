import { Container, Table } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Employeesdata() {
    const [empdata, setEmpdata] = useState([])
    useEffect(() => {
        getApi()
    }, [])
    const getApi = () => {
        axios.get('http://127.0.0.1:8000/employees')
            .then((res) => {
                let data = res.data
                setEmpdata(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <Container>
            <Table withBorder>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Reume Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        empdata.length != 0 &&
                        empdata.map((emp, index) =>
                            <tr key={index}>
                                <td>{emp.firstname}</td>
                                <td>{emp.lastname}</td>
                                <td>{emp.email}</td>
                                <td>{emp.phonecode} {emp.phonenumber}</td>
                                <td>{emp.resume}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Container>
    )
}

export default Employeesdata