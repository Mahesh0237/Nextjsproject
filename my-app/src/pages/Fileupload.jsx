import { Button, Container, FileInput, LoadingOverlay, Stack } from '@mantine/core'
import React, { useState } from 'react'
import axios from 'axios'

function Fileupload() {
    const [isloadingoverlay, setIsloadingoverlay] = useState(false)
    const [fileupload, setFileupload] = useState(null)
    const [fileError, setFileError] = useState('')

    const updateFile = (value) => {
        setFileupload(value)
        setFileError('')
    }

    const uploadfile = async () => {
        setIsloadingoverlay(true)

        if (fileupload === null) {
            setFileError('select the file')
            setIsloadingoverlay(false)
            return false
        }

        const formData = new FormData()
        formData.append('file', fileupload)

        try {
            const response = await axios.post('http://127.0.0.1:8000/fileupload/addnew', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsloadingoverlay(false)
        }
    }

    return (
        <Container>
            <Stack>
                <FileInput
                    placeholder="Pick file"
                    label="Your resume"
                    withAsterisk
                    value={fileupload}
                    error={fileError}
                    onChange={updateFile}
                />
                <Button onClick={uploadfile}>submit</Button>
            </Stack>
            <LoadingOverlay visible={isloadingoverlay} />
        </Container>
    )
}

export default Fileupload
