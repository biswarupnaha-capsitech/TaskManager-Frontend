import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Divider,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Skeleton,
    SkeletonItem,
    Spinner,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import {
    Add20Regular,
    Dismiss20Regular,
    Home20Regular,
    Line20Filled,
    Person20Regular,
    SignOut20Regular,
} from "@fluentui/react-icons";
import { useAppDispatch, useAppSelector } from "../app/store";
import { logout } from "../app/features/authSlice";
import { Sidebar } from "../components/SideBar";
import ProjectForm from "../components/ProjectForm";
import { useToast } from "../hooks/useToast";
import { useProjects } from "../hooks/useProjects";
import type { Project, Task } from "../common/types";
import { authService } from "../api/services/authService";
import Header from "../components/Header";
import { resetTasks } from "../app/features/taskSlice";
import { useTasks } from "../hooks/useTasks";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { PencilLine, Trash2 } from "lucide-react";
import { deleteProject } from "../api/services/projectService";

const useStyles = makeStyles({
    shell: { minHeight: "100dvh", backgroundColor: tokens.colorNeutralBackground3 },
    mobileBar: {
        display: "none",
        "@media (max-width: 760px)": {
            display: "flex",
            height: "56px",
            alignItems: "center",
            padding: "0 12px",
            backgroundColor: tokens.colorNeutralBackground1,
            borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        },
    },
    content: {
        minWidth: 0,
        minHeight: "100vh",
        marginLeft: "248px",
        "@media (max-width: 760px)": { marginLeft: 0 },
    },
    top: {
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        "@media (max-width: 760px)": { display: "none" },
    },
    skeletonRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
    },
    main: {
        height: "100dvh",
        maxWidth: "100dvw",
        margin: "0 auto",
        position: "relative",
        top: "12dvh",
        padding: "200px",
        "@media (max-width: 760px)": { padding: "24px 16px 40px" },
    },
    mobileTitle: { flex: 1, marginLeft: "8px" },
    profile: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 8px 4px",
    },
    profileText: { minWidth: 0, flex: 1 },
});

export function AppLayout() {
    const styles = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppSelector((s) => s.auth.user);
    const { projects, isLoading } = useProjects();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { notify } = useToast();
    const { fetchProjects, removeProject } = useProjects();
    const { tasksQueryClient } = useTasks();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Task | null>(null);


    useEffect(() => {
        fetchProjects()
            .then(data => !data?.status && notify(data?.msg, "error"));
    }, []);

    const fName = user?.name.split("")[0] ?? "";
    const lName = user?.name.split("")[1] ?? "";
    const initials = `${fName.charAt(0)} ${lName.charAt(0)}`.toUpperCase();

    const title = location.pathname.startsWith("/profile")
        ? "Profile"
        : location.pathname === "/projects"
            ? "All Tasks"
            : "Project";

    function handleDelete(id: string) {
        removeProject(id).then(data =>
            notify(data.msg, data.status ? "success" : "error"));
    }

    function handleEdit(id: string) {
        const project = projects.find((t) => t.id === id);
        if (project) {
            setIsProjectModalOpen(true);
            setEditingProject(project);
        }
    }

    return (
        <div className={styles.shell}>
            <Sidebar
                isLoading={isLoading}
                projects={projects}
                setIsProjectModalOpen={setIsProjectModalOpen}
                setEditingProject={setEditingProject}
                onNewProject={() => setIsProjectModalOpen(true)}
                onNavigate={navigate}
                onLogout={async () => {
                    await authService.logout();
                    dispatch(logout());
                    navigate("/login");
                }}
                user={user}
            />
            <Drawer
                open={drawerOpen}
                onOpenChange={(_, data) => setDrawerOpen(data.open)}
                type="overlay"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close navigation"
                                icon={<Dismiss20Regular />}
                                onClick={() => setDrawerOpen(false)}
                            />
                        }
                        className="py-2"
                    >
                        TaskManager
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className="flex flex-col items-start">
                    <Button
                        appearance="subtle"
                        icon={<Home20Regular />}
                        onClick={() => { navigate("/"); setDrawerOpen(false); }}
                    >
                        All Tasks
                    </Button>
                    <Divider />
                    <div className="h-full py-5">
                        {isLoading ? (
                            <Skeleton>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={styles.skeletonRow}>
                                        <SkeletonItem shape="rectangle" style={{ width: "100%", height: "16px" }} />
                                    </div>
                                ))}
                            </Skeleton>) :
                            projects.map((p) => (
                                <div className="flex w-60 justify-between">
                                    <Button
                                        key={p.id}
                                        appearance="subtle"
                                        onClick={() => { navigate(`/projects/${p.id}`); setDrawerOpen(false); }}
                                    >
                                        {p.title}
                                    </Button>
                                    {/* <PencilLine
                                className="text-yellow-500 hover:text-yellow-700" onClick={() => handleEdit(p.id)} /> */}
                                    <Dialog>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Trash2
                                                className="text-red-500 hover:text-red-700" />
                                        </DialogTrigger>
                                        <DialogSurface>
                                            <DialogBody>
                                                <DialogTitle>Delete confirmation</DialogTitle>
                                                <DialogContent>
                                                    Are you sure you want to delete this project?
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button appearance="primary" onClick={() => handleDelete(p.id)}>Confirm</Button>
                                                    <DialogTrigger disableButtonEnhancement>
                                                        <Button appearance="secondary">Cancel</Button>
                                                    </DialogTrigger>
                                                </DialogActions>
                                            </DialogBody>
                                        </DialogSurface>
                                    </Dialog>
                                </div>
                            ))}
                    </div>
                    <Divider />
                    <div className="py-5">
                        <Button
                            appearance="subtle"
                            icon={<Person20Regular />}
                            onClick={() => { navigate("/profile"); setDrawerOpen(false); }}
                        >
                            Profile
                        </Button>
                        <Button
                            appearance="subtle"
                            icon={<Add20Regular />}
                            onClick={() => { setIsProjectModalOpen(true); setDrawerOpen(false); }}
                        >
                            New project
                        </Button>
                        <Dialog>
                            <DialogTrigger disableButtonEnhancement>
                                <Button
                                    appearance="subtle"
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
                        <div className={styles.profile}>
                            <Avatar
                                name={`${user?.name ?? ""}`}
                                size={32}
                            />
                            <div className={styles.profileText}>
                                <Text weight="semibold" truncate block>
                                    {user?.name}
                                </Text>
                                <Text size={200} truncate block>{user?.email}</Text>
                            </div>
                        </div>
                    </div>
                </DrawerBody>
            </Drawer>

            <div className={styles.content}>
                <Header
                    setDrawerOpen={setDrawerOpen}
                    setIsModalOpen={setIsModalOpen}
                    setEditingTodo={setEditingTodo}
                    name={`${user?.name}`}
                    initials={initials}
                />
                <main className={styles.main}>
                    <Outlet />
                    {/* <main className="mx-auto top-40 relative max-w-5xl p-6 px-8"> */}
                    <TaskList onEdit={(task) => {
                        setEditingTodo(task);
                        setIsModalOpen(true);
                    }} />
                    {/* </main> */}
                </main>
            </div>
            {
                isModalOpen && (
                    <TaskForm
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        toEdit={!!editingTodo}
                        task={editingTodo}
                    />
                )
            }
            {
                isProjectModalOpen && (
                    <ProjectForm
                        isModalOpen={isProjectModalOpen}
                        setIsModalOpen={setIsProjectModalOpen}
                        toEdit={!!editingProject}
                        project={editingProject}
                    />
                )
            }
        </div>
    );
}