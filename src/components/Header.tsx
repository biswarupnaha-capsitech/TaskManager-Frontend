import type React from 'react';
import { logout } from '../app/features/authSlice';
import { resetTasks } from '../app/features/taskSlice';
import { useAppDispatch } from '../app/store';
import { useToast } from '../hooks/useToast';
import type { SetStateAction } from 'react';
import type { Project, Task } from '../common/types';
import { authService } from '../api/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Hamburger } from '@fluentui/react-components';
import { Home20Regular } from '@fluentui/react-icons';

const Header = ({ setIsModalOpen, setEditingTodo, setDrawerOpen, name, initials }: {
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
                    <Button
                        appearance="primary"
                        icon={<Hamburger />}
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open navigation"
                    />
                </span>
                <h1 className="text-xl md:text-4xl font-bold text-white">
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
                    <div className='flex justify-center items-center'>
                        <Avatar name={name} initials={initials} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header