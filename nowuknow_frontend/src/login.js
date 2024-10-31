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
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Login() {
    const navigate = useNavigate(); // Usar o hook useNavigate
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        navigate('/register'); // Navegar para a rota de registro
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://seu-backend-url/api/login', {
                'email': email,
                'senha': password
            });
            console.log('Login successful:', response.data);
            // Redirecionar ou tratar o login bem-sucedido aqui
        } catch (error) {
            console.error('Login failed:', error);
            // Tratar o erro de login aqui
        }
    };

    return (
        <MDBContainer fluid>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>
                    <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                        <MDBCardBody className='p-5 w-100 d-flex flex-column'>
                            <h2 className="fw-bold mb-2 text-center">Sign in</h2>

                            <MDBInput wrapperClass='mb-4 w-100' label='Email address' type='email'
                                size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />

                            <MDBInput wrapperClass='mb-4 w-100' label='Password' type='password' size="lg"
                                value={password} onChange={(e) => setPassword(e.target.value)} />

                            <MDBCheckbox name='flexCheck' className='mb-4' label='Remember password' />

                            <MDBBtn size='lg' onClick={handleLogin}>Login</MDBBtn>

                            <hr className="my-4" />

                            <MDBBtn className="mb-2 w-100" size="lg" style={{ backgroundColor: '#dd4b39' }}>
                                <MDBIcon fab icon="google" className="mx-2" />
                                Sign in with google
                            </MDBBtn>

                            <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>
                                <MDBIcon fab icon="facebook-f" className="mx-2" />
                                Sign in with facebook
                            </MDBBtn>

                            <br />

                            <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#808080' }} onClick={handleSignUp}>
                                Sign up
                            </MDBBtn>

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;
