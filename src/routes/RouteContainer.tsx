import { Routes, Route, BrowserRouter } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ProtectedRoute from "./ProtectedRoute"
import { AppLayout } from "../layout/AppLayout"
import DashboardPage from "../pages/dashboard/DashboardPage"
import TasksPage from "../pages/task/TaskPage"
import ProjectPage from "../pages/project/ProjectPage"
// import ProjectPage from "../pages/projects/ProjectPage"
// import ProfilePage from "../pages/profile/ProfilePage"

const RouteContainer = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* renders at exactly "/" */}
                    <Route index element={<DashboardPage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="projects/:id" element={<ProjectPage />} />
                    {/* <Route path="profile" element={<ProfilePage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouteContainer