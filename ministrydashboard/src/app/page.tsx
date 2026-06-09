"use client"


import { Col, Row } from 'antd';
import CustomTextInput from '@/components/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import Spacer from '@/components/Spacer';
import Logo from '@/components/Logo';
import { Formik } from 'formik';
import * as Yup from "yup"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CustomToast from '@/components/CustomToast';
import { useAppDispatch } from '@/redux/hooks';
import { _getAdminByToken,_adminLogin } from '@/redux/actions/admin.actions';
import { useEffect } from 'react';
import { clearAdminLoginState } from '@/redux/features/admin.slice';
import { keys } from '@/constants/localstorageKeys';
import CustomPasswordInput from '@/components/CustomPasswordInput';
import { useRouter } from 'next/navigation';

type Props = {}

type formDataType = {
    email: string
    password: string
}

const Page = ({ }: Props) => {

    const {
        isError,
        isSuccess,
        msg,
        loading
    } = useSelector((state: RootState) => state.adminSlice)

    const dispatch = useAppDispatch()
    const router = useRouter();



    useEffect(() => {
        if (isSuccess) {

            dispatch(clearAdminLoginState())
            setTimeout(() => {
                router.push("/admin/dashboard")
            }, 2000)
        }

        if (isError) {
            setTimeout(() => {
                dispatch(clearAdminLoginState())
            }, 4000)
        }
    }, [isSuccess, isError])





    const handleLogin = (values: formDataType) => {
        dispatch(_adminLogin(values))
    }

    const authenticateSuperAdmin = () => {

        let token = localStorage.getItem(keys.ADMIN_ACCESS_TOKEN_KEY)
        token && dispatch(_getAdminByToken({ token: token }))
        //TODO if token is not found
        //error
    }



    const LoginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(6, "Password must have atleast 6 characters")
            .max(50, "Too Long!")
            .required("Password is required"),
        //vite
    })

    return (
        <Row style={{ height: "100vh" }} >
            <Col xs={24} sm={24} md={8}></Col>
            <Col xs={24} sm={24} md={8}>
                {/* toast */}
                <CustomToast
                    show={isError || isSuccess}
                    isError={isError}
                    isSuccess={isSuccess}
                    message={msg}
                />
                {/* form here */}
                <Formik
                    onSubmit={(values, actions) => {

                        handleLogin(values)
                        actions.resetForm()
                    }}
                    initialValues={{
                        email: "",
                        password: ""
                    }}

                    validationSchema={LoginSchema}
                >
                    {
                        ({ values, errors, handleSubmit, handleChange, touched }) => {

                            return (
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Spacer height={20} />
                                    {/* add logo */}
                                    <Logo />

                                    <Spacer height={25} />


                                    <CustomTextInput
                                        placeholder='Email'
                                        onChange={handleChange("email")}
                                        value={values.email}
                                        error={touched.email && errors.email ? errors.email : ""}
                                    />
                                    <Spacer height={15} />
                                    <CustomPasswordInput
                                        placeholder='Password'
                                        onChange={handleChange("password")}
                                        value={values.password}
                                        error={touched.password && errors.password ? errors.password : ""}
                                        disabled={false}
                                    />

                                    <Spacer height={25} />

                                    <CustomButton
                                        title='Login'
                                        loading={loading}
                                        onClick={() => handleSubmit()}

                                    />


                                </div>
                            )
                        }
                    }
                </Formik>
            </Col>
            <Col xs={24} sm={24} md={8} ></Col>
        </Row>
    )
}

export default Page