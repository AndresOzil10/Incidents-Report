import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import IncidentsReport from "../pages/IncidentsReport";
import NotFound from "../pages/NotFound";
import LayoutIni from "../components/Common/LayoutIni";
import Vacations from "../pages/Vacations";
import BH from "../pages/BH";
import Register from "../pages/Register";
import EditList from "../pages/EditList";
import ListIncidentsOptions from "../pages/ListIncidentsOptions";
import PersonalIncidents from "../pages/PersonalIcidents";


export const router = createBrowserRouter([
    {
        path: '/vite/',
        element: <Login />,
        errorElement: <NotFound />
    },
    {
        path: '/home',
        element: <LayoutIni />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'report',
                element: <IncidentsReport />
            },
            {
                path: 'vacations',
                element: <Vacations />
            },
            {
                path: 'hours',
                element: <BH />
            },
            {
                path: 'edit',
                element: <EditList />,
            },
            {
                path: 'request',
                element: <ListIncidentsOptions />,
            },
            {
                path: 'personal',
                element: <PersonalIncidents />,
            },
        ]
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <NotFound />
    },

    
])