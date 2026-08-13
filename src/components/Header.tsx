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
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Hamburger } from '@fluentui/react-components';
import { SignOut20Regular } from '@fluentui/react-icons';

const Header = ({ setDrawerOpen, }: {
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>,
    setDrawerOpen: React.Dispatch<SetStateAction<boolean>>,
    setEditingTodo: React.Dispatch<SetStateAction<Task | null>>,
    name: string,
    initials: string
}) => {
    const dispatch = useAppDispatch();
    const { notify } = useToast();
    const navigate = useNavigate();
    const { tasksQueryClient } = useTasks();

    return (
        <header className=" bg-[#115EA3] w-full fixed shadow-lg z-10">
            <div className="md:w-[75dvw] lg:w-[85dvw] md:md-px-50 px-5 py-8 justify-between flex items-center">
                <span className='md:hidden'>
                    <Hamburger
                        appearance="primary"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open navigation"
                    />
                </span>
                <h1 className="text-xl md:text-4xl font-bold text-white">
                    Task Manager
                </h1>
                <div className='flex md:gap-x-12 gap-x-5'>
                    {/* <button
                        onClick={() => {
                            setEditingTodo(null);
                            setIsModalOpen(true);
                        }}
                        className="rounded-4xl bg-white px-3 py-2 md:px-6 md:py-3 font-medium text-[#115EA3] shadow-md transition hover:shadow-lg hover:bg-[#e5e6e7]  text-xs md:text-lg hover:cursor-pointer"
                    >
                        + New Task
                    </button> */}
                    {/* <h5 className="text-lg font-bold text-white">
                        Welcome, {user?.name}
                    </h5> */}
                    {/* <div className='flex justify-center items-center'>
                        <Avatar name={name} initials={initials} />
                    </div> */}
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <Button
                                appearance="secondary"
                                icon={<SignOut20Regular />}
                            >
                                Log out
                            </Button>
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