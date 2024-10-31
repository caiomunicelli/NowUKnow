import React, { useState } from 'react';
import axios from 'axios'; // Importar o axios
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://seu-backend-url/api/register', {
                'nome': name,
                'email': email,
                'senha': password,
                'tipo': 'estudante'
            });
            console.log('Registration successful:', response.data);
            // Redirecionar ou tratar o registro bem-sucedido aqui
        } catch (error) {
            console.error('Registration failed:', error);
            // Tratar o erro de registro aqui
        }
    };


    return (
        <MDBContainer fluid>

            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>

                    <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                        <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                            <h2 className="fw-bold mb-2 text-center">Sign up</h2>

                            <MDBInput wrapperClass='mb-4 w-100' label='Name' type='text' size="lg" 
                             value={name} onChange={(e) => setName(e.target.value)}/>

                            <MDBInput wrapperClass='mb-4 w-100' label='Email address'  type='email' size="lg" 
                            value={email} onChange={(e) => setEmail(e.target.value)}/>

                            <MDBInput wrapperClass='mb-4 w-100' label='Password' type='password' size="lg" 
                            value={password} onChange={(e) => setPassword(e.target.value)} />

                            <MDBBtn size='lg' onClick={handleRegister}>
                                Register
                            </MDBBtn>

                            <hr className="my-4" />

                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>
            </MDBRow>

        </MDBContainer>
    );
}

export default Register;