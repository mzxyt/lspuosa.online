import AdminDashboard from "@/Components/AdminDashboard";
import SuperAdminDashboard from "@/Components/SuperAdminDashboard";
import UnitHeadDashboard from "@/Components/UnitHeadDashboard";
import PanelLayout from "@/Layouts/PanelLayout";

export default function Dashboard({ auth }) {
  return (
    <PanelLayout userAuth={auth} defaultActiveLink="dashboard">
      <div className="content-wrapper">
        {auth.role === "unit_head" ? (
          <UnitHeadDashboard auth={auth} />
        ) : auth.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <SuperAdminDashboard />
        )}
      </div>
    </PanelLayout>
  );
}
