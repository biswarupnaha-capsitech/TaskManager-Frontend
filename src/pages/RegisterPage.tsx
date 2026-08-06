import {
    Button,
    Checkbox,
    MessageBar,
    MessageBarBody,
    Text,
    makeStyles,
} from "@fluentui/react-components";

import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import { authService } from "../api/authService";

const useStyles = makeStyles({
    row: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    footer: {
        marginTop: "24px",
        textAlign: "center",
    },
});

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
    acceptTerms: Yup.bool()
        .oneOf([true], "Accept the terms"),
});

export default function RegisterPage() {
    const styles = useStyles();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");

    return (
        <div
            title="Create account"
        >
            {serverError && (
                <MessageBar intent="error">
                    <MessageBarBody>
                        {serverError}
                    </MessageBarBody>
                </MessageBar>
            )}
            <Formik
                initialValues={{
                    name: {
                        first: "",
                        last: "",
                    },
                    email: "",
                    phoneNumber: "",
                    acceptTerms: false
                }}
                validationSchema={schema}
                onSubmit={async (values, helpers) => {
                    setServerError("");
                    try {
                        await authService.register({
                            name: {
                                first: values.name.first,
                                last: values.name.last,
                            },
                            email: values.email,
                            phoneNumber: values.phoneNumber
                        });
                        navigate("/login");
                    }
                    catch (err: any) {
                        setServerError(
                            err.response?.data?.message ??
                            "Registration failed."
                        );
                    }
                    helpers.setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => (
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.row}>
                            <Field
                                label="First Name"
                                name="firstName"
                                value={values.name.first}
                                placeholder="John"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={
                                    touched.name?.first
                                        ? errors.name?.first
                                        : ""
                                }
                            />
                            <Field
                                label="Last Name"
                                name="lastName"
                                value={values.name.last}
                                placeholder="Doe"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={
                                    touched.name?.last
                                        ? errors.name?.last
                                        : ""
                                }
                            />
                        </div>
                        <Field
                            label="Email"
                            name="email"
                            value={values.email}
                            placeholder="john@example.com"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={
                                touched.email
                                    ? errors.email
                                    : ""
                            }
                        />

                        <Field
                            label="Phone Number"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={
                                touched.phoneNumber
                                    ? errors.phoneNumber
                                    : ""
                            }
                        />

                        <Checkbox

                            label="I agree to the Terms & Conditions"

                            checked={values.acceptTerms}

                            onChange={(_, data) =>
                                setFieldValue(
                                    "acceptTerms",
                                    data.checked
                                )

                            }

                        />
                        {touched.acceptTerms &&
                            errors.acceptTerms && (
                                <Text
                                    size={200}
                                    style={{
                                        color: "#d13438"
                                    }}
                                >
                                    {errors.acceptTerms}
                                </Text>

                            )}
                        <Button
                            disabled={isSubmitting}
                        >
                            Create Account
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
                            fontWeight: 600
                        }}
                    >
                        Login
                    </RouterLink>
                </Text>
            </div>
        </div>
    );

}