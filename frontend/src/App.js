import { Outlet, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import api from './api';
import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import RenterDashboard from './pages/renter/RenterDashboard';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import NavScrollExample from './components/Navbar';
import Footer from './components/Footer';
import UploadProfileImage from './pages/profile/UploadProfilePhoto';
import ChangePassword from './pages/profile/ChangePassword';
import AddProperty from './pages/owner/property/AddProperty';
import EditProperty from './pages/owner/property/EditProperty';
import MyProperties from './pages/owner/property/MyProperties';
import BrowseProperties from './pages/BrowseProperties';
import PropertyDetails from './pages/PropertyDetails';
import RenterDashboardHome from './pages/renter/RenterDashboardHome';
import OwnerDashboardHome from './pages/owner/OwnerDashboardHome';
import OwnerProfile from './pages/OwnerProfile';
import ManagePropertyImages from './pages/owner/property/ManagePropertyImage';
import Favorites from './pages/renter/Favorites';
import VisitRequests from './pages/renter/visit/VisitRequests';
import RequestVisit from './pages/renter/visit/RequestVisit';
import Reviews from './pages/renter/Reviews';
import RentalApplication from './pages/renter/applications/RentalApplication';
import MyApplication from './pages/renter/applications/MyApplication';
import RentPayment from './pages/renter/payments/RentPayment';
import Maintenance from './pages/renter/maintenance/Maintenance';
import CreateMaintenance from './pages/renter/maintenance/CreateMaintenance';
import RentalApplications from './pages/owner/applications/RentelApplications';
import OwnerVisitRequests from './pages/owner/visit/OwnerVisitRequest';
import Lease from './pages/renter/Lease';
import OwnerLeases from './pages/owner/leases/OwnerLeases';
import OwnerVisitRequestDetails from './pages/owner/visit/OwnerVisitRequestDetails';
import OwnerApplicationDetails from './pages/owner/applications/ApplicationDetails';
import VisitRequestDetails from './pages/renter/visit/VisitRequestDetails';
import MyApplicationDetails from './pages/renter/applications/MyApplicationDetails';
import OwnerMaintenance from './pages/owner/maintenance/OwnerMaintenance';
import LeaseDetails from './pages/owner/leases/LeaseDetails';
import CreateLease from './pages/owner/leases/CreateLease';
import CreateDirectLease from './pages/owner/leases/CreateDirectLease';
import Tenants from './pages/owner/leases/Tenants';
import TenantDetails from './pages/owner/leases/TenantDetails';
import OwnerPayments from './pages/owner/payments/OwnerPayments';
import PaymentDetails from './pages/owner/payments/PaymentDetails';
import MaintenanceDetails from './pages/owner/maintenance/MaintenanceDetails';
import PaymentHistory from './pages/renter/payments/PaymentHistory';
import PaymentDetail from './pages/renter/payments/PaymentDetail';
import MaintenanceDetail from './pages/renter/maintenance/MaintenanceDetail';
import EditMaintenance from './pages/renter/maintenance/EditMaintenance';
import OwnerLeaseExtensions from './pages/owner/leaseextension/OwnerLeaseExtension';
import LeaseExtensionDetails from './pages/owner/leaseextension/LeaseExtensionDetails';
import RenterLeaseExtension from './pages/renter/leaseextension/RenterLeaseExtension';
import RequestLeaseExtension from './pages/renter/leaseextension/RequestLeaseExtension';
import RenterLeaseExtensionDetails from './pages/renter/leaseextension/RenterExtensionDetails';
import Notifications from './pages/Notifications';
import PreviousTenants from './pages/owner/leases/PreviousTenants';

function DashboardLayout(){
  return(
    <>
    <NavScrollExample/>
    <Outlet/>
    </>
  )
}
function PublicLayout() {
  return (
    <>
      <NavScrollExample />
      <Outlet />
      <Footer />
    </>
  )
}

function AuthLayout() {
  return (
    <>
      <NavScrollExample/>
      <Outlet/>
    </>
  )
}

function App() {
  useEffect(() => {
    api.get("accounts/users/csrf/")
  },[])

  return (
    <>
      <Routes>

        <Route element={<PublicLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path='/properties' element={<BrowseProperties/>}/>
          <Route path='/properties/:id' element={<PropertyDetails/>}/>
          <Route path='/owners/:id' element={<OwnerProfile/>}/>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<DashboardLayout/>}>

        <Route path="/owner-dashboard" element={<OwnerDashboard />}>
          <Route index element={<OwnerDashboardHome/>} />
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='upload-profile-picture' element={<UploadProfileImage/>}/>
          <Route path='change-password' element={<ChangePassword/>}/>
          
          <Route path='add-property' element={<AddProperty/>}/>
          <Route path='edit-property/:id' element={<EditProperty/>}/>
          <Route path='my-properties' element={<MyProperties/>}/>

          <Route path='properties' element={<BrowseProperties/>}/>
          
          <Route path='property-images/:id' element={<ManagePropertyImages/>}/>
          
          <Route path='visit-request' element={<OwnerVisitRequests/>}/>
          <Route path='visit-request/:id' element={<OwnerVisitRequestDetails/>}/>

          <Route path='rental-application' element={<RentalApplications/>}/>
          <Route path='rental-application/:id' element={<OwnerApplicationDetails/>}/>

          <Route path='lease' element={<OwnerLeases/>}/>
          <Route path='lease/:id' element={<LeaseDetails/>}/>
          <Route path='lease/create/:applicationId' element={<CreateLease/>}/>
          <Route path='lease/create-direct' element={<CreateDirectLease/>}/>

          <Route path='tenants' element={<Tenants/>}/>
          <Route path='tenants/:id' element={<TenantDetails/>}/>
          <Route path='previous-tenants' element={<PreviousTenants/>}/>

          <Route path='rent-payment' element={<OwnerPayments/>}/>
          <Route path='rent-payment/:id' element={<PaymentDetails/>}/>
          <Route path='rent-payment/:id/confirm' element={<RentPayment/>}/>

          <Route path='maintenance' element={<OwnerMaintenance/>}/>
          <Route path='maintenance/:id' element={<MaintenanceDetails/>}/>

          <Route path='lease-extension' element={<OwnerLeaseExtensions/>}/>
          <Route path='lease-extension/:id' element={<LeaseExtensionDetails/>}/>

          <Route path='notifications' element={<Notifications/>}/>
        </Route>

        <Route path='/renter-dashboard' element={<RenterDashboard />}>
          <Route index element={<RenterDashboardHome/>} />
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='upload-profile-picture' element={<UploadProfileImage/>}/>
          <Route path='change-password' element={<ChangePassword/>}/>

          <Route path='properties' element={<BrowseProperties/>}/>

          <Route path='favorites' element={<Favorites/>}/>
          <Route path='visit-request' element={<VisitRequests/>}/>
          <Route path='visit-request/:id' element={<VisitRequestDetails/>}/>

          <Route path='reviews' element={<Reviews/>}/>
          <Route path='reviews/new/:propertyId' element={<Reviews/>}/>
          <Route path="reviews/edit/:id" element={<Reviews/>}/>
          
          <Route path='rental-application/new/:visitId' element={<RentalApplication/>}/>
          <Route path='my-application' element={<MyApplication/>}/>
          <Route path='my-application/:id' element={<MyApplicationDetails/>}/>
          
          <Route path='lease' element={<Lease/>}/>

          <Route path='rent-payment' element={<RentPayment/>}/>
          <Route path='payment-history' element={<PaymentHistory/>}/>
          <Route path='rent-payment/:id' element={<PaymentDetail/>}/>

          <Route path='maintenance' element={<Maintenance/>}/>
          <Route path='maintenance/create' element={<CreateMaintenance/>}/>
          <Route path='maintenance/:id' element={<MaintenanceDetail/>}/>
          <Route path='maintenance/edit/:id' element={<EditMaintenance/>}/>

          <Route path='lease-extension' element={<RenterLeaseExtension/>}/>
          <Route path='lease-extension/request' element={<RequestLeaseExtension/>}/>
          <Route path='lease-extension/:id' element={<RenterLeaseExtensionDetails/>}/>

          <Route path='notifications' element={<Notifications/>}/>
      
        </Route>
      </Route>
      <Route path='/properties/:id/request-visit' element={<RequestVisit/>}/>


      </Routes>
    </>


  );
}

export default App;
