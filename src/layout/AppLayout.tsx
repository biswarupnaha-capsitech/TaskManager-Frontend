import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import {
    Add20Regular,
    Dismiss20Regular,
    Home20Regular,
    TaskListLtr24Filled,
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
import { PencilLine, Trash2 } from "lucide-react";
import TaskForm from "../components/TaskForm";

const useStyles = makeStyles({
    shell: { minHeight: "100dvh", backgroundColor: tokens.colorNeutralBackground3 },
    section: {
        padding: "22px 10px 8px",
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    projectButton: { justifyContent: "flex-start", width: "100%", height: "50px" },
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
    proj: {
        margin: "0 0 10px 10px"
    },
    main: {
        height: "100dvh",
        maxWidth: "68dvw",
        margin: "auto",
        position: "relative",
        top: "15dvh",
        // padding: "200px",
        "@media (max-width: 760px)": { padding: "24px 16px 40px", maxWidth: "100%" },
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
    const user = useAppSelector((s) => s.auth.user);
    const { projects, isLoading } = useProjects();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { notify } = useToast();
    const { fetchProjects, removeProject } = useProjects();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Task | null>(null);


    useEffect(() => {
        fetchProjects()
            .then(data => !data?.status && notify(data?.msg, "error"));
    }, []);

    const fName = user?.name?.split("")[0] ?? "";
    const lName = user?.name?.split("")[1] ?? "";
    const initials = `${fName.charAt(0)} ${lName.charAt(0)}`.toUpperCase();

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
                    await authService.logout().then(data =>
                        notify(data?.message, data.status ? "success" : "error")
                    );
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
                        className="py-5"
                    >
                        <img src="/logo.webp" alt="TaskManager" width={70} />
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody className="flex flex-col items-start">
                    <Button
                        appearance="subtle"
                        icon={<Home20Regular />}
                        className={styles.projectButton}
                        onClick={() => navigate("/")}
                    >
                        Dashboard
                    </Button>
                    <Button
                        appearance="subtle"
                        icon={<TaskListLtr24Filled />}
                        className={styles.projectButton}
                        onClick={() => navigate("/tasks")}
                    >
                        All tasks
                    </Button>

                    <div className={styles.section}>Projects</div>
                    <Divider />
                    <div className="h-full py-5 flex flex-col gap-2">
                        {isLoading ? (
                            <Skeleton>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={styles.skeletonRow}>
                                        <SkeletonItem shape="rectangle" style={{ width: "100%", height: "16px" }} />
                                    </div>
                                ))}
                            </Skeleton>
                        ) :
                            projects.map((p) => (
                                <div className="flex w-65 gap-5">
                                    <div
                                        key={p.id}
                                        onClick={() => { navigate(`/projects/${p.id}`); setDrawerOpen(false); }}
                                        className={`w-full font-medium rounded-2xl flex justify-center items-center hover:bg-gray-50 hover:cursor-pointer ${p.isCompleted && "bg-green-200 hover:bg-green-200 pointer-events-none cursor-not-allowed"}`}
                                    >
                                        {p.title}
                                    </div>
                                    <PencilLine
                                        className="text-yellow-500 hover:text-yellow-700" onClick={() => handleEdit(p.id)} />
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
                    <Button
                        appearance="subtle"
                        icon={<Add20Regular />}
                        onClick={() => { setIsProjectModalOpen(true); setDrawerOpen(false); }}
                        className={styles.proj}
                    >
                        New project
                    </Button>
                    <Divider />
                    <div className="py-5">
                        {/* <Button
                            appearance="subtle"
                            icon={<Person20Regular />}
                            onClick={() => { navigate("/profile"); setDrawerOpen(false); }}
                        >
                            Profile
                        </Button> */}

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