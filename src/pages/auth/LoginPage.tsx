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

import {
    Eye24Regular,
    EyeOff24Regular,
} from "@fluentui/react-icons";

import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { authService } from "../../api/services/authService";
import { login } from "../../app/features/authSlice";
import { useAppDispatch } from "../../app/store";
import { useToast } from "../../hooks/useToast";

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

const schema = Yup.object({
    userName: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
    const styles = useStyles();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const { notify } = useToast();
    const dispatch = useAppDispatch();

    return (
        <div className={styles.root}>
            <Card className={styles.card}>
                <div className={styles.icon}>
                    <img src="/logo.png" alt="TaskManager" className="w-20" />
                </div>

                <Text className={styles.title} size={700} weight="semibold">
                    Welcome back
                </Text>

                <Text className={styles.subtitle}>
                    Login to continue to your account
                </Text>

                {serverError && (
                    <MessageBar intent="error">
                        <MessageBarBody>{serverError}</MessageBarBody>
                    </MessageBar>
                )}

                <Formik
                    initialValues={{
                        userName: "",
                        password: "",
                    }}
                    validationSchema={schema}
                    onSubmit={async (values, helpers) => {
                        setServerError("");
                        try {
                            await authService.login(values).then(data => {
                                dispatch(login(data?.result));
                                notify(data?.message, data.status ? "success" : "error");
                                navigate("/");
                            });
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
                                label="Email"
                                validationMessage={touched.userName ? errors.userName : ""}
                            >
                                <Input
                                    name="userName"
                                    placeholder="john@example.com"
                                    value={values.userName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field
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
                                {isSubmitting ? <Spinner size="tiny" /> : "Login"}
                            </Button>
                        </form>
                    )}
                </Formik>

                <div className={styles.footer}>
                    <Text>
                        Don't have an account?{" "}
                        <RouterLink
                            to="/register"
                            style={{
                                color: "#6D4AFF",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            Register
                        </RouterLink>
                    </Text>
                </div>
            </Card>
        </div>
    );
}
