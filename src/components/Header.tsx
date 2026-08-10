import type React from 'react';
import { logout } from '../app/features/authSlice';
import { resetTasks } from '../app/features/taskSlice';
import { useAppDispatch } from '../app/store';
import { useToast } from '../hooks/useToast';
import type { SetStateAction } from 'react';
import type { Task } from '../common/types';
import { authService } from '../api/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from '@fluentui/react-components';

const Header = ({ setIsModalOpen, setEditingTodo }: {
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>,
    setEditingTodo: React.Dispatch<SetStateAction<Task | null>>,
}) => {
    const dispatch = useAppDispatch();
    const { notify } = useToast();
    const navigate = useNavigate();
    const { tasksQueryClient } = useTasks();

    return (
        <header className="bg-[#115EA3] w-full fixed shadow-lg">
            <div className="mx-auto max-w-5xl px-6 py-8 flex justify-between items-center">
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                    Task Manager
                </h1>
                <div className='flex md:gap-x-12 gap-x-5'>
                    <button
                        onClick={() => {
                            setEditingTodo(null);
                            setIsModalOpen(true);
                        }}
                        className="rounded-4xl bg-white px-3 py-2 md:px-6 md:py-3 font-medium text-[#115EA3] shadow-md transition hover:shadow-lg hover:bg-[#e5e6e7]  text-xs md:text-lg hover:cursor-pointer"
                    >
                        + New Task
                    </button>
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <button
                                className="rounded-4xl bg-red-400 px-3 py-2 md:px-7 md:py-4 font-medium text-white shadow-md transition hover:shadow-lg hover:bg-[#e7e5e5] hover:text-red-400 text-xs md:text-lg hover:cursor-pointer"
                            >
                                Log out
                            </button>
                        </DialogTrigger>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>Log out confirmation</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to log out?
                                </DialogContent>
                                <DialogActions>
                                    <Button appearance="primary" onClick={async () => {
                                        await authService.logout().then(data => {
                                            dispatch(logout());
                                            dispatch(resetTasks());
                                            tasksQueryClient.clear();
                                            notify(data?.message, data.status ? "success" : "error");
                                            navigate("/login");
                                        }).catch(error => {
                                            console.log(error?.message);
                                            notify("Something went wrong", "error");
                                        });
                                    }}>Confirm</Button>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">Cancel</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                </div>
            </div>
        </header>
    )
}

export default Header