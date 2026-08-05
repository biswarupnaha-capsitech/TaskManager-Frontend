import React from "react";
import { Formik, Form, Field } from "formik";
import { Status } from "../common/enums";
import { useTasks } from "../context/TaskContext";
import type { Task } from "../common/types";

const TaskForm = ({
    setIsModalOpen,
    toEdit,
    task,
}: {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toEdit?: boolean;
    task?: Task | null;
}) => {

    const { addTask, updateTask } = useTasks();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in">
                <h2 className="mb-6 text-2xl font-bold text-slate-800">
                    {toEdit ? "Edit Task" : "Create Task"}
                </h2>

                <Formik
                    enableReinitialize
                    initialValues={{
                        title: task?.title ?? "",
                        description: task?.description ?? "",
                        status: task?.status ?? Status.PENDING,
                        isDeleted: task?.isDeleted ?? false,
                    }}
                    onSubmit={(values) => {
                        if (toEdit && task) {
                            updateTask(task.id, values);
                        } else {
                            addTask(values);
                        }

                        setIsModalOpen(false);
                    }}
                >
                    <Form className="space-y-5">
                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Title
                            </label>

                            <Field
                                name="title"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Description
                            </label>

                            <Field
                                as="textarea"
                                rows={4}
                                name="description"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        {toEdit && <div>
                            <label className="mb-2 block font-medium text-slate-700">
                                Status
                            </label>

                            {<Field
                                as="select"
                                name="status"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            >
                                <option value={Status.PENDING}>Pending</option>
                                <option value={Status.IN_PROGRESS}>
                                    In Progress
                                </option>
                                <option value={Status.COMPLETED}>
                                    Completed
                                </option>
                            </Field>}
                        </div>}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-xl border px-5 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-indigo-600 px-6 py-2 text-white shadow-md transition hover:bg-indigo-700"
                            >
                                {toEdit ? "Update Task" : "Create Task"}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default TaskForm;