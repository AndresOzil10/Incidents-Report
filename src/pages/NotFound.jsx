import { Link, useRouteError } from "react-router-dom"


const NotFound = () => { 
    const error = useRouteError()
    console.log(error)

    return <>
    <div>
        <h1>404</h1>
        <p>Page Not Found</p>
        <p>{error.statusText || error.message}</p>

        <Link to="/vite/">Back to Login</Link>

    </div>
    </>
 }

 export default NotFound