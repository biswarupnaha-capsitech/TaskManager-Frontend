import React from "react";
import { Formik, Form, Field } from "formik";
import type { Project } from "../common/types";
import { useToast } from "../hooks/useToast";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Input, Label, Textarea } from "@fluentui/react-components";
import { BanIcon } from "lucide-react";
import { useProjects } from "../hooks/useProjects";

const ProjectForm = ({
    isModalOpen,
    setIsModalOpen,
    toEdit,
    project,
}: {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toEdit?: boolean;
    project?: Project | null;
}) => {

    const { addProject, editProject } = useProjects();
    const { notify } = useToast();

    return (
        <Dialog modalType="non-modal" open={isModalOpen}>
            <DialogSurface
                aria-describedby={undefined}
                className="w-full max-w-[95vw] rounded-2xl p-0"
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        title: project?.title ?? "",
                        description: project?.description ?? "",
                        isCompleted: project?.isCompleted ?? false,
                        isDeleted: project?.isDeleted ?? false,
                    }}
                    onSubmit={(values) => {
                        if (toEdit && project) {
                            editProject(project.id, {
                                ...values,
                                isCompleted: values.isCompleted,
                            }).then((data) =>
                                notify(data.msg, data.status ? "success" : "error")
                            );
                        } else {
                            addProject(values).then((data) =>
                                notify(data.msg, data.status ? "success" : "error")
                            );
                        }

                        setIsModalOpen(false);
                    }}
                >
                    <Form>
                        <DialogBody className="p-6">
                            <DialogTitle className="text-2xl font-semibold" action={
                                <Button
                                    appearance="subtle"
                                    icon={<BanIcon />}
                                    onClick={() => setIsModalOpen(false)}
                                />
                            }>
                                {toEdit ? "Update Project" : "Create Project"}
                            </DialogTitle>

                            <DialogContent className="mt-6 flex flex-col gap-5">
                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <Label required htmlFor="title">
                                        Title
                                    </Label>

                                    <Field name="title">
                                        {({ field }: any) => (
                                            <Input
                                                {...field}
                                                id="title"
                                                size="large"
                                                appearance="outline"
                                                placeholder="Enter project title"
                                                className="w-full"
                                                required
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>

                                    <Field name="description">
                                        {({ field }: any) => (
                                            <Textarea
                                                {...field}
                                                id="description"
                                                resize="vertical"
                                                rows={5}
                                                placeholder="Describe your project..."
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Is Completed */}
                                {toEdit && (
                                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <Label
                                                htmlFor="isCompleted"
                                                className="cursor-pointer text-sm font-medium text-neutral-800"
                                            >
                                                Mark as completed
                                            </Label>

                                            <span className="text-xs text-neutral-500">
                                                Complete this project when you're done.
                                            </span>
                                        </div>

                                        <Field name="isCompleted">
                                            {({ field, form }: any) => (
                                                <button
                                                    type="button"
                                                    id="isCompleted"
                                                    role="checkbox"
                                                    aria-checked={field.value}
                                                    onClick={() =>
                                                        form.setFieldValue("isCompleted", !field.value)
                                                    }
                                                    className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${field.value
                                                            ? "bg-blue-600"
                                                            : "bg-neutral-300"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${field.value
                                                                ? "translate-x-5"
                                                                : "translate-x-0.5"
                                                            }`}
                                                    />
                                                </button>
                                            )}
                                        </Field>
                                    </div>
                                )}
                            </DialogContent>

                            <DialogActions className="mt-8 flex justify-end gap-3">
                                <Button appearance="primary" type="submit">
                                    {toEdit ? "Update Project" : "Create Project"}
                                </Button>

                                <Button
                                    appearance="secondary"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>

                            </DialogActions>
                        </DialogBody>
                    </Form>
                </Formik>
            </DialogSurface>
        </Dialog>
    );
};

export default ProjectForm;