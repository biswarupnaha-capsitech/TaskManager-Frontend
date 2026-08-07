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
import { authService } from "../api/authService";
import { useToast } from "../context/ToastContext";
import { ClipboardTask24Regular } from "@fluentui/react-icons";

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
        .min(10, "Minimum 10 characters")
        .max(10, "Maximum 10 characters")
        .required("Phone numberis required"),
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
        width: "430px",
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

    return (
        <div className={styles.root}>
            <Card className={styles.card}>
                <div className={styles.icon}>
                    <ClipboardTask24Regular primaryFill="#6D4AFF" fontSize={48} />
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
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, helpers) => {
                        setServerError("");
                        try {
                            await authService.register(values).then(data => {
                                notify("Successfully registered! Your default password is: welcome", data.status ? "success" : "error");
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
                            <Field
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
                            <Field
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
