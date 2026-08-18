import React from "react";
import { Formik, Form, Field } from "formik";
import { Status } from "../common/enums";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../common/types";
import { useToast } from "../hooks/useToast";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, Input, Label, makeStyles, Textarea, Title3 } from "@fluentui/react-components";
import { useAppSelector } from "../app/store";
import { DatePicker } from "@fluentui/react-datepicker-compat"

const useStyles = makeStyles({
    control: {
        maxWidth: "300px",
        opacity: "100%"
    },
});

const TaskForm = ({
    isModalOpen,
    setIsModalOpen,
    toEdit,
    task,
}: {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toEdit?: boolean;
    task?: Task | null;
}) => {

    const { addTask, editTask } = useTasks();
    const { notify } = useToast();
    const projects = useAppSelector(s => s.projects.projects);
    const styles = useStyles();

    return (
        <Dialog modalType="non-modal" open={isModalOpen}>
            <DialogSurface
                aria-describedby={undefined}
                className="w-full max-w-[95vw] rounded-2xl p-0"
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        title: task?.title ?? "",
                        description: task?.description ?? "",
                        status: task?.status ?? Status.Pending,
                        isDeleted: task?.isDeleted ?? false,
                        projectId: task?.projectId ?? "",
                        dueDate: task?.dueDate ?? ""
                    }}
                    onSubmit={(values) => {
                        if (toEdit && task) {
                            editTask(task.id, {
                                ...values,
                                status: Number(values.status),
                            }).then((data) =>
                                notify(data.msg, data.status ? "success" : "error")
                            );
                        } else {
                            addTask(values).then((data) =>
                                notify(data.msg, data.status ? "success" : "error")
                            );
                        }
                        setIsModalOpen(false);
                    }}
                >
                    <Form>
                        <DialogBody className="p-6">
                            <Title3 className="text-2xl font-semibold">
                                {toEdit ? "Update Task" : "Create Task"}
                            </Title3>

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
                                                size="large"
                                                appearance="outline"
                                                placeholder="Enter task title"
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
                                                resize="vertical"
                                                rows={5}
                                                placeholder="Describe your task..."
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Project */}
                                <div className="flex flex-col gap-2">
                                    <Label required htmlFor="project">
                                        Project
                                    </Label>

                                    <Field name="projectId">
                                        {({ field }: any) => (
                                            <select
                                                {...field}
                                                required
                                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                                            >
                                                <option value="" hidden>select</option>
                                                {projects.map(project =>
                                                    <option key={project.id} value={project.id}>{project.title}</option>
                                                )}
                                            </select>
                                        )}
                                    </Field>
                                </div>
                                
                                {/* Due */}
                                <div className="flex flex-col gap-2">
                                    <Label required htmlFor="due">
                                        Due date
                                    </Label>

                                    <Field name="dueDate">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                required
                                                appearance="underline"
                                                className={styles.control}
                                                placeholder="Select a date..."
                                                value={field.value ? new Date(field.value) : null}
                                                onSelectDate={(date) => {
                                                    form.setFieldValue("dueDate", date ? date.toISOString() : null);
                                                }}
                                                onBlur={() => form.setFieldTouched("dueDate", true)}
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Status */}
                                {toEdit && (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="status">
                                            Status
                                        </Label>

                                        <Field name="status">
                                            {({ field }: any) => (
                                                <select
                                                    {...field}
                                                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                                                >
                                                    <option value={Status.Pending}>Pending</option>
                                                    <option value={Status.InProgress}>
                                                        In Progress
                                                    </option>
                                                    <option value={Status.Completed}>
                                                        Completed
                                                    </option>
                                                </select>
                                            )}
                                        </Field>
                                    </div>
                                )}
                            </DialogContent>

                            <DialogActions className="mt-8 flex justify-end gap-3">
                                <Button appearance="primary" type="submit">
                                    {toEdit ? "Update Task" : "Create Task"}
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
        </Dialog >
    );
};

export default TaskForm;