import React from "react";
import { Formik, Form, Field } from "formik";
import { Status } from "../common/enums";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../common/types";
import { useToast } from "../hooks/useToast";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Input, Label, Textarea } from "@fluentui/react-components";
import { BanIcon } from "lucide-react";

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
                            <DialogTitle className="text-2xl font-semibold" action={
                                <Button
                                    appearance="subtle"
                                    icon={<BanIcon />}
                                    onClick={() => setIsModalOpen(false)}
                                />
                            }>
                                {toEdit ? "Update Task" : "Create Task"}
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
                                                id="description"
                                                resize="vertical"
                                                rows={5}
                                                placeholder="Describe your task..."
                                                className="w-full"
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
                                                    id="status"
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
        </Dialog>
    );
};

export default TaskForm;