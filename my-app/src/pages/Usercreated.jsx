import { Alert, Container, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

function Usercreated() {
    return (
        <Container>
            <Alert icon={<IconAlertCircle size="1rem" />} color="green">
               <Text weight="bold" size={15}> Registration done successfully, you can now login the page by enetering the email and password</Text>
                <Link href="/Loginpage">click here to login</Link>
            </Alert>
        </Container>
    )
}

export default Usercreated