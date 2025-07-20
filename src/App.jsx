import './App.css'

// ------  FROM REACT-ROUTER-DOM  ------ //
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// ------  CONTEXT  ------ //
import Context from './Context/Context';

// ------ PAGES  ------ //
import Login from './Pages/Login/Login';
import Forgotpwd from './Pages/ForgotPwd/Forgotpwd';
import Dashboard from './Pages/Dashboard/Dashboard';
import AllSellers from './Pages/Sellers/AllSellers';
import SellerBusiness from './Pages/Sellers/SellerBusiness';
import Referals from './Pages/MyAction/Referals';
import MyTransactions from './Pages/MyAction/MyTransactions';
import WithdrawalsPage from './Pages/Users/Withdrawals/Withdrawals';
import SellerDetails from './Pages/Sellers/SellerDetails';
import ProfilePage from './Pages/MyAction/Profile';
import Notifications from './Pages/MyAction/Notifications';
import PaymentOptionsPage from './Pages/PaymentOptions/PaymentOption';
import PaymentOptionsDetails from './Pages/PaymentOptions/PaymentOptionsDetails';
import MyPaymentOptions from './Pages/MyAction/MyPaymentOptions';
import RegionManagement from './Pages/Sellers/Region';
import Shipping from './Pages/Sellers/Shipping';
import ShippingForm from './Pages/Sellers/ShippingForm';
import CountryManagement from './Pages/Sellers/Country';
import BusinessTypeManagement from './Pages/Sellers/BussinessType';
import CreateTalent from './Pages/Talent/CreateTalent';
import TalentList from './Pages/Talent/TalentList';
import PasswordReset from './Pages/PasswordReset/PasswordReset';
import Categories from './Pages/Talent/Categories';
import CreateCategory from './Pages/Talent/CreateCategories';
import BusinessPage from './Pages/Talent/Bussiness';
// import AdminMessage from './Pages/Others/Admins/AdminMessage';
import Admins from './Pages/Others/Admins/Admins';

// ------ LAYOUTS -------  //
import Rootlayout from './Layouts/Rootlayout';
import ProtectedRoute from './Layouts/ProtectedRoute';

import DashboardLayout from './Layouts/DashboardLayout';
// import AdminDetails from './Pages/Others/Admins/AdminDetails';
import RoleManagement from './Pages/Others/Admins/Role';
import TalentCategories from './Pages/Talent/TalentCategories';
import TalentRequest from './Pages/Talent/TalentRequest';
import ProductDisplay from './Pages/Talent/WinnerProducts';
import ContestantDetails from './Pages/Talent/ContestantDetails';
import TalentDetails from './Pages/Talent/TalentDetails';
import TalentHuntSettings from './Pages/Talent/TalentHuntSettings';
import TalentCategoryManagement from './Pages/Talent/TalentCategoryManagement';
import LiveStreams from './Pages/Talent/TalentLiveStreams';
import WinnerProductManagement from './Pages/Talent/WinnerProductmanagement';
import AdminActivityDetails from './Pages/Others/Admins/AdminDetails';
import ChatList from './Pages/Others/Admins/AdminChatList';
import Chat from './Pages/Others/Admins/Chats';

import AppBannerManagement from './Pages/Others/Banner/BannerList';
import LogisticsServices from './Pages/Others/Logistics/LogisticsService';
import EliteVideos from './Pages/Sellers/Services/Elite/EliteVideos';
import Elite from './Pages/Sellers/Services/Elite/Elite';
import EliteDetails from './Pages/Sellers/Services/Elite/EliteDetails';
import StoresPage from './Pages/Talent/TalentStore';
import LatestStylesPage from './Pages/Talent/LatestStyles';
import GiftCardFundsPage from './Pages/GiftCard/GiftCard';
import BrandFiltersPage from './Pages/Brands/BrandsPage';
import GiftCategoriesPage from './Pages/GiftCard/GiftCategories';
import GiftAllUsersPage from './Pages/GiftCard/GiftUser';
import Groceries from './Pages/Sellers/Services/Groceries/Groceries';
import GroceryDetails from './Pages/Sellers/Services/Groceries/GroceryDetails';
import AddGProduct from './Pages/Sellers/Services/Groceries/AddGProduct';
import ManageGOrders from './Pages/Sellers/Services/Groceries/ManageGOrders';
import ManageGReturns from './Pages/Sellers/Services/Groceries/ManageGReturn';
import ManageGInventory from './Pages/Sellers/Services/Groceries/ManageGInventory';
import PaymentGroceryPage from './Pages/Sellers/Services/Groceries/PaymentG';
// import TwoFactor from './Pages/TwoFactor';
import TwoFactor from './Pages/TwoFactor';
import AdminReelsDashboard from './Pages/Sellers/Services/Reels/Reels';
import ReelUserManagementPage from './Pages/Sellers/Services/Reels/ReelUsers';
import ReelUserDetailsPage from './Pages/Sellers/Services/Reels/ReelsDetails';
import GroceriesBloomzonRevenueDashboard from './Pages/Sellers/Services/Groceries/GroceriesAnalytics';
import AdminGroceriesManagement from './Pages/Sellers/Services/Groceries/GroceriesAdminAddProducts';



{/* This would be the list of all the services on that platform */}
const bloomzonServices = ["BloomZon Product", "Groceries & Beverages", "Foods & Restaurants", "Bloomzon Healthcare","Used item","Automobile & Parts", "Real Estate", "Bloomzon Reels", "Bloomzon TV", "Bloomzon Live", "Manufacturer", "TrueView", "Logistics Services" , "Bloomzon Elite"];

function App() {
  
  const routes = createRoutesFromElements(
    <Route path='/' element={<Rootlayout/>}>
      <Route index element={<Login/>}/>
      <Route path='forgot' element={<Forgotpwd/>}/>
      <Route path='password/reset' element={<PasswordReset/>}/>
      <Route path="/two-factor" element={<TwoFactor />} />
      <Route path='dashboard' element={
         <ProtectedRoute>
           <DashboardLayout/>
         </ProtectedRoute>
      }
        >
        <Route index element={
          // <ProtectedRoute>
      <Dashboard />
    // </ProtectedRoute>
    }/>
        <Route path='sellers' element={<Rootlayout/>}>
          <Route path='all' element={<AllSellers/>}/>
          <Route path='region' element={<RegionManagement/>}/>
          <Route path='business/type' element={<BusinessTypeManagement/>}/>
          <Route path='country' element={<CountryManagement/>}/>
          <Route path='shipping' element={<Rootlayout/>}>
            <Route index element={<Shipping/>}/>
            <Route path='edit/:shipping' element={<ShippingForm/>}/>
          </Route>
          <Route path=':seller' element ={<SellerDetails/>}/>
          <Route path='paymentOptions' element={<Rootlayout/>}>
           <Route index element={<PaymentOptionsPage/>} />
           <Route path=':paymentOptions' element={<PaymentOptionsDetails/>}/>
          </Route>
          <Route path='business' element={<Rootlayout/>}>
            <Route path=':business' element={<SellerBusiness/>}/>
          </Route>
          <Route path='services' element={<Rootlayout/>}>
            <Route path='elite' element={<Rootlayout/>}>
              <Route index element={<Elite/>}/>
              <Route path=':eliteUsers' element={<EliteDetails/>}/>
              <Route path='videos' element={<EliteVideos/>}/>
             </Route>
             <Route path='reels' element={<Rootlayout/>}>
                <Route index element={<ReelUserManagementPage/>}/>
                <Route path='analytics' element={<AdminReelsDashboard/>}/>
                <Route path=':reels' element={<ReelUserDetailsPage/>}/>
             </Route>
             <Route path='groceries-beverages' element={<Rootlayout/>}>
              <Route index element={<Groceries/>}/>
              <Route path='analytics' element={<GroceriesBloomzonRevenueDashboard/>}/>
              <Route path='management' element={<AdminGroceriesManagement/>}/>
              <Route path=':groceryId' element={<Rootlayout/>}>
                <Route index element={<GroceryDetails/>}/>
                <Route path='add-product' element={<AddGProduct/>}/>
                <Route path='manage-orders' element={<ManageGOrders/>}/>
                <Route path='manage-returns' element={<ManageGReturns/>}/>
                <Route path='manage-inventory' element={<ManageGInventory/>}/>
                <Route path='payments' element={<PaymentGroceryPage/>}/>
              </Route>  
            </Route>
          </Route>
        </Route>
        <Route path='user' element={<Rootlayout/>}>
          <Route path='all' element={<AllSellers/>}/>
          <Route path='withdrawals' element={<WithdrawalsPage/>}/>
        </Route>
        <Route path='actions' element={<Rootlayout/>}>
          <Route path='referals' element={<Referals/>}/>
          <Route path='transaction' element={<MyTransactions/>}/>
          <Route path='profile' element={<ProfilePage/>}/>
          <Route path='notifications' element={<Notifications/>}/>
          <Route path='paymentoptions' element={<MyPaymentOptions/>}/>
        </Route>
        <Route path='talent' element={<Rootlayout/>}>
          <Route path='create' element={<CreateTalent/>}/>
          <Route path='settings' element={<TalentHuntSettings/>}/>
          <Route path='live' element={<Rootlayout/>}>
            <Route index element={<TalentCategories/>}/>
            <Route path=':liveTalent' element={<LiveStreams/>}/>
          </Route>
          <Route path='categories' element={<TalentCategoryManagement/>}/>
          <Route path='talentlist' element={<TalentList/>}/>
          <Route path='winner/products' element={<ProductDisplay/>}/>
          <Route path='winner/products/create' element={<WinnerProductManagement/>}/>
          <Route path='winner/store' element={<StoresPage/>}/>
          <Route path='winner/latestStyles' element={<LatestStylesPage/>}/>
         
          {/* <Route path='category' element={<TalentCategories/>}/> */}
          <Route path='contestants' element={<Rootlayout/>}>
            <Route path='categories' element={<TalentCategories/>}/>
            <Route path=':requestTalent' element={<Rootlayout/>}>
              <Route index element={<TalentRequest/>}/>
              <Route path=':contestantId' element={<TalentDetails/>}/>
            </Route>
          </Route>
          <Route  path='request' element={<Rootlayout/>}>
            <Route path= 'category' element={<TalentCategories/>}/>
            <Route path=':requestTalent' element={<Rootlayout/>}>
                <Route index element={<TalentRequest/>}/>
                <Route path=':requestContestantId' element={<ContestantDetails/>}/>
            </Route>
          </Route>
        </Route>
        <Route path='giftCards' element={<Rootlayout/>}>
            <Route index element={<GiftCardFundsPage/>}/>
            <Route path='brands' element={<BrandFiltersPage/>}/>
            <Route path='users' element={<GiftAllUsersPage/>}/>
            <Route path='category' element={<GiftCategoriesPage/>}/>
        </Route>
        
        <Route path='product-categories'>
          <Route path='categories' element={<Categories/>}/>
          <Route path='create/categories' element={<CreateCategory/>}/>
        </Route>
        <Route path='others' element={<Rootlayout/>}>
          <Route path='admins' element={<Rootlayout/>}>
            <Route index element={<Admins/>}/>
            <Route path=':admin' element={<AdminActivityDetails/>}/>
            <Route path='messages' element={<Rootlayout/>}>
                <Route index element={<ChatList/>}/>
                <Route path=':message' element={<Chat/>}/>
            </Route>
            <Route path='banner' element={<AppBannerManagement/>}/>
            <Route path='logistics' element={<LogisticsServices/>}/>
            <Route path='roles' element={<RoleManagement/>}/>
            <Route path='bussiness' element={<BusinessPage/>}/>
          </Route>
          
        </Route>
        
      </Route>
    </Route>
  )
  
  const router = createBrowserRouter(routes);
  return (
    <Context>
      <RouterProvider router={router}>
      </RouterProvider>
    </Context>
  )
}

export default App
