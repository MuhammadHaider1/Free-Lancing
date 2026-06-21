import ClientDashboard from "./ClientDashboard";
import FreelancerDashboard from "./FreelancerDashboard";


function Dashboard(){

    const role = localStorage.getItem("role");


    if(role === "client"){
        return <ClientDashboard />;
    }


    if(role === "freelancer"){
        return <FreelancerDashboard />;
    }


    return (
        <h2 className="text-center mt-10">
            Please Login
        </h2>
    )

}


export default Dashboard;