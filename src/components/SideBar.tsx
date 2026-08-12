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
    Skeleton,
    SkeletonItem,
    Text,
    Tooltip,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import {
    Add20Regular,
    Home20Regular,
    Person20Regular,
    SignOut20Regular,
} from "@fluentui/react-icons";
import type { Project, User } from "../common/types";
import { useNavigate } from "react-router-dom";
import { PencilLine, Trash2 } from "lucide-react";
import { deleteProject } from "../api/services/projectService";
import { useToast } from "../hooks/useToast";
import { useProjects } from "../hooks/useProjects";

const useStyles = makeStyles({
    root: {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "248px",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px 12px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        boxSizing: "border-box",
        "@media (max-width: 760px)": { display: "none" },
    },
    brand: { padding: "0 10px 24px" },
    nav: { display: "flex", flexDirection: "column", gap: "2px" },
    section: {
        padding: "22px 10px 8px",
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    projectButton: { justifyContent: "flex-start", width: "100%" },
    bottom: { marginTop: "auto" },
    profile: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 8px 4px",
    },
    profileText: { minWidth: 0, flex: 1 },
    skeletonRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
    },
});

export function Sidebar({
    projects,
    isLoading,
    setEditingProject,
    setIsProjectModalOpen,
    onNewProject,
    onNavigate,
    onLogout,
    user,
}: {
    projects: Project[];
    isLoading: boolean;
    setEditingProject: React.Dispatch<React.SetStateAction<Project | null>>;
    setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onNewProject: () => void;
    onNavigate: (path: string) => void;
    onLogout: () => void;
    user: User | null;
}) {
    const styles = useStyles();
    const navigate = useNavigate();
    const { notify } = useToast();
    const { removeProject } = useProjects();

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
        <aside className={styles.root}>
            <div className={styles.brand}>
                <Text size={500} weight="bold">TaskManager</Text>
            </div>

            <nav className={styles.nav}>
                <Button
                    appearance="subtle"
                    icon={<Home20Regular />}
                    className={styles.projectButton}
                    onClick={() => onNavigate("/")}
                >
                    Dashboard
                </Button>

                <div className={styles.section}>Projects</div>
                <Divider />

                <div className="h-full py-5 flex flex-col gap-5">
                    {isLoading ? (
                        <Skeleton>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className={styles.skeletonRow}>
                                    <SkeletonItem shape="rectangle" style={{ width: "100%", height: "16px" }} />
                                </div>
                            ))}
                        </Skeleton>
                    ) : (
                        projects.map((p) => (
                            <div key={p.id} className="flex justify-between">
                                <div
                                    onClick={() => navigate(`/projects/${p.id}`)}
                                    className="w-full font-medium flex justify-center items-center hover:bg-gray-50 hover:cursor-pointer"
                                >
                                    {p.title}
                                </div>
                                <div className="flex gap-2">
                                    <PencilLine className="text-yellow-500 hover:text-yellow-700 w-5" onClick={() => handleEdit(p.id)} />
                                    <Dialog>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Trash2 className="text-red-500 hover:text-red-700 w-5" />
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
                            </div>
                        ))
                    )}
                </div>

                <Tooltip content="Create a project" relationship="label">
                    <Button
                        appearance="subtle"
                        icon={<Add20Regular />}
                        className={styles.projectButton}
                        onClick={onNewProject}
                    >
                        New project
                    </Button>
                </Tooltip>
            </nav>

            <div className={styles.bottom}>
                <Divider />
                <Button
                    appearance="subtle"
                    icon={<Person20Regular />}
                    className={styles.projectButton}
                    onClick={() => onNavigate("/profile")}
                >
                    Profile
                </Button>
                <Button
                    appearance="subtle"
                    icon={<SignOut20Regular />}
                    className={styles.projectButton}
                    onClick={onLogout}
                >
                    Sign out
                </Button>

                <div className={styles.profile}>
                    <Avatar name={`${user?.name ?? ""}`} size={32} />
                    <div className={styles.profileText}>
                        <Text weight="semibold" truncate block>{user?.name}</Text>
                        <Text size={200} truncate block>{user?.email}</Text>
                    </div>
                </div>
            </div>
        </aside>
    );
}