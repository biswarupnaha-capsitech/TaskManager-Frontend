import {
    Button,
    Card,
    Field,
    Input,
    MessageBar,
    MessageBarBody,
    Spinner,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";

import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../api/services/authService";
import { useToast } from "../../hooks/useToast";
import { Eye24Regular, EyeOff24Regular } from "@fluentui/react-icons";

const schema = Yup.object({
    name: Yup.object({
        first: Yup.string()
            .required("First name is required"),
        last: Yup.string()
            .required("Last name is required")
    }),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number is not valid')
        .required("Phone numberis required"),
    password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character')
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required("Confirm password is required")
});


const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: "32px",
    },

    card: {
        width: "512px",
        borderRadius: "20px",
        padding: "36px",
        boxShadow: tokens.shadow16,
    },

    icon: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "16px",
    },

    title: {
        textAlign: "center",
        marginBottom: "4px",
    },

    subtitle: {
        display: "block",
        textAlign: "center",
        color: tokens.colorNeutralForeground3,
        marginBottom: "32px",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    loginButton: {
        marginTop: "8px",
        height: "44px",
        fontWeight: 600,
    },

    footer: {
        marginTop: "24px",
        textAlign: "center",
    },
});

export default function RegisterPage() {
    const styles = useStyles();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const { notify } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={styles.root}>
            <Card className={styles.card}>
                <div className={styles.icon}>
                    <img src="/logo.png" alt="TaskManager" className="w-20" />
                </div>

                <Text className={styles.title} size={700} weight="semibold">
                    Get started
                </Text>

                <Text className={styles.subtitle}>
                    Register to continue to your account
                </Text>

                {serverError && (
                    <MessageBar intent="error">
                        <MessageBarBody>{serverError}</MessageBarBody>
                    </MessageBar>
                )}

                <Formik
                    initialValues={{
                        name: {
                            first: "",
                            last: ""
                        },
                        email: '',
                        phoneNumber: "",
                        password: "",
                        confirmPassword: ''
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, helpers) => {
                        setServerError("");
                        try {
                            await authService.register({
                                name: values.name,
                                email: values.email,
                                phoneNumber: values.phoneNumber,
                                passwordHash: values.password
                            }).then(data => {
                                notify(data?.message, data.status ? "success" : "error");
                                if (data.status) navigate("/login", { replace: true });
                            })
                        } catch (err: any) {
                            setServerError(err.response?.data?.message ?? "Login failed.");
                        }
                        helpers.setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        handleBlur,
                        handleChange,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className="md:flex md:justify-between">

                                <Field
                                    id="fname"
                                    label="First Name"
                                    validationMessage={touched.name?.first ? errors.name?.first : ""}
                                >
                                    <Input
                                        name="name.first"
                                        placeholder="Enter your first name"
                                        value={values.name.first}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Field>
                                <Field
                                    id="lname"
                                    label="Last Name"
                                    validationMessage={touched.name?.last ? errors.name?.last : ""}
                                >
                                    <Input
                                        name="name.last"
                                        placeholder="Enter your last name"
                                        value={values.name.last}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Field>
                            </div>
                            <Field
                                id="email"
                                label="Email"
                                validationMessage={touched.email ? errors.email : ""}
                            >
                                <Input
                                    name="email"
                                    placeholder="john@example.com"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field
                                id="phn"
                                label="Phone Number"
                                validationMessage={touched.phoneNumber ? errors.phoneNumber : ""}
                            >
                                <Input
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field
                                id="password"
                                label="Password"
                                validationMessage={touched.password ? errors.password : ""}
                            >
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    contentAfter={
                                        showPassword ? (
                                            <EyeOff24Regular
                                                onClick={() => setShowPassword(false)}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ) : (
                                            <Eye24Regular
                                                onClick={() => setShowPassword(true)}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                id="cpassword"
                                label="Confirm Password"
                                validationMessage={touched.confirmPassword ? errors.confirmPassword : ""}
                            >
                                <Input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={values.confirmPassword}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    contentAfter={
                                        showConfirmPassword ? (
                                            <EyeOff24Regular
                                                onClick={() => setShowConfirmPassword(false)}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ) : (
                                            <Eye24Regular
                                                onClick={() => setShowConfirmPassword(true)}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        )
                                    }
                                />
                            </Field>

                            <div className={styles.row}>
                                <RouterLink
                                    to="/forgot-password"
                                >
                                    Forgot Password?
                                </RouterLink>
                            </div>

                            <Button
                                appearance="primary"
                                type="submit"
                                size="large"
                                disabled={isSubmitting}
                                className={styles.loginButton}
                            >
                                {isSubmitting ? <Spinner size="tiny" /> : "Register"}
                            </Button>
                        </form>
                    )}
                </Formik>

                <div className={styles.footer}>
                    <Text>
                        Already have an account?{" "}
                        <RouterLink
                            to="/login"
                            style={{
                                color: "#6D4AFF",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            Login
                        </RouterLink>
                    </Text>
                </div>
            </Card>
        </div>
    );
}
