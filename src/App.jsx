import './App.css'

// ------  FROM REACT-ROUTER-DOM  ------ //
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

// ------  CONTEXT  ------ //
import Context from './Context/Context';

// ------ PAGES  ------ //
import Login from './Pages/Login/Login';
import Forgotpwd from './Pages/ForgotPwd/Forgotpwd';
import Dashboard from './Pages/Dashboard/Dashboard';
import OperationsCenter from './Pages/Operations/OperationsCenter';
import AdminProfitabilityWorkspace from './Pages/Admin/AdminProfitabilityWorkspace';
import AdminVendorSettlementWorkspace from './Pages/Admin/AdminVendorSettlementWorkspace';
import OrdersPage from './Pages/Orders/Orders';
import FoodOrdersPage from './Pages/Orders/FoodOrders';
import AdminSalesReportWorkspace from './Pages/Admin/AdminSalesReportWorkspace';
import {
  AdminCommissionsWorkspace,
  AdminRefundsWorkspace,
  AdminServiceChargeWorkspace,
} from './Pages/Admin/AdminFinanceWorkspaces';
import ProductsPage from './Pages/Products/Products';
import ProductDetailsPage from './Pages/Products/ProductDetails';
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
import BusinessPage from './Pages/Talent/Bussiness';
// import AdminMessage from './Pages/Others/Admins/AdminMessage';
import Admins from './Pages/Others/Admins/Admins';

// ------ LAYOUTS -------  //
import Rootlayout from './Layouts/Rootlayout';
import ProtectedRoute, { RequireAdminPermissions } from './Layouts/ProtectedRoute';

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
import AdminActivitiesWorkspace from './Pages/Admin/AdminActivitiesWorkspace';
import AdminSupportWorkspace from './Pages/Admin/AdminSupportWorkspace';
import AdminStoreDetailsWorkspace from './Pages/Admin/AdminStoreDetailsWorkspace';
import AdminStoreManagementWorkspace from './Pages/Admin/AdminStoreManagementWorkspace';
import ServiceAnalyticsWorkspace from './Pages/Admin/ServiceAnalyticsWorkspace';
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
import ReelUserManagementPage from './Pages/Sellers/Services/Reels/ReelUsers';
import ReelUserDetailsPage from './Pages/Sellers/Services/Reels/ReelsDetails';
import AdminGroceriesManagement from './Pages/Sellers/Services/Groceries/GroceriesAdminAddProducts';
import HealthCareUserManagement from './Pages/Sellers/Services/Healthcare/Healthcare';
import Food from './Pages/Sellers/Services/Food/Food';
import FoodUserDetails from './Pages/Sellers/Services/Food/FoodUserDetails';
import UsedItemsAdmin from './Pages/Sellers/Services/UsedItems/UsedItems';
import UsedItemDetails from './Pages/Sellers/Services/UsedItems/UsedItemDetails';
import AutomobileAdminDashboard from './Pages/Sellers/Services/Automobiles/Automobiles';
import AutomobileVehicleDetails from './Pages/Sellers/Services/Automobiles/VehiclesDetails';
import AdminRealEstateDashboard from './Pages/Sellers/Services/RealEstate/RealEstate';
import RealestateAdminDetailView from './Pages/Sellers/Services/RealEstate/RealtorDetails';
import BloomzonTVAdminDashboard from './Pages/Sellers/Services/BloomzonTV/BloomzonTVAdminDashboard';
import ReelsOrdersPage from './Pages/Sellers/Services/Reels/ReelsOrders';
import AuditLogs from './Pages/Admin/AuditLogs';
import AdminTVRequests from './Pages/Sellers/Services/Tv/BTv';
import BloomzonTVSettings from './Pages/Sellers/Services/Tv/BTvSettings';
import {
  BloomzonAccessWorkspace,
  BloomzonContentWorkspace,
  BloomzonFinanceWorkspace,
  BloomzonMarketingWorkspace,
  BloomzonOrdersWorkspace,
  BloomzonSettingsWorkspace,
  BloomzonSupportWorkspace,
  BloomzonUsersWorkspace,
} from './Pages/BloomzonAdmin/BloomzonAdminWorkspaces';
import {
  LegalDocumentPage,
  LegalHubPage,
} from './Pages/Legal/LegalDocumentation';


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
        <Route
          index
          element={
            <RequireAdminPermissions permissions='dashboard:view'>
              <Dashboard />
            </RequireAdminPermissions>
          }
        />
        <Route path='admin-system' element={<Rootlayout/>}>
          <Route index element={<Navigate to="/dashboard/admin-system/overview" replace />} />
          <Route path='overview' element={<RequireAdminPermissions permissions='dashboard:view'><Dashboard/></RequireAdminPermissions>} />
          <Route path='access' element={<RequireAdminPermissions permissions={['admins:view', 'admins:manage']}><BloomzonAccessWorkspace/></RequireAdminPermissions>} />
          <Route path='orders' element={<RequireAdminPermissions permissions={['orders:view', 'finance:view']}><BloomzonOrdersWorkspace/></RequireAdminPermissions>} />
          <Route path='users' element={<RequireAdminPermissions permissions={['users:view', 'subscriptions:view']}><BloomzonUsersWorkspace/></RequireAdminPermissions>} />
          <Route path='content' element={<RequireAdminPermissions permissions={['products:view', 'domains:view']}><BloomzonContentWorkspace/></RequireAdminPermissions>} />
          <Route path='support' element={<RequireAdminPermissions permissions={['orders:view', 'users:view']}><BloomzonSupportWorkspace/></RequireAdminPermissions>} />
          <Route path='marketing' element={<RequireAdminPermissions permissions={['reports:view', 'reports:export']}><BloomzonMarketingWorkspace/></RequireAdminPermissions>} />
          <Route path='finance' element={<RequireAdminPermissions permissions={['finance:view', 'reports:view']}><BloomzonFinanceWorkspace/></RequireAdminPermissions>} />
          <Route path='settings' element={<RequireAdminPermissions permissions={['settings:view', 'settings:manage']}><BloomzonSettingsWorkspace/></RequireAdminPermissions>} />
        </Route>
        <Route path='operations' element={<RequireAdminPermissions permissions={['orders:view', 'finance:view']}><OperationsCenter/></RequireAdminPermissions>} />
        <Route path='operations/profitability' element={<RequireAdminPermissions permissions={['finance:view', 'reports:view']}><AdminProfitabilityWorkspace/></RequireAdminPermissions>} />
        <Route path='operations/vendor-settlements' element={<RequireAdminPermissions permissions={['finance:view', 'finance:manage']}><AdminVendorSettlementWorkspace/></RequireAdminPermissions>} />
        <Route path='reports' element={<Rootlayout/>}>
          <Route path='sales' element={<RequireAdminPermissions permissions={['reports:view', 'reports:export']}><AdminSalesReportWorkspace/></RequireAdminPermissions>} />
        </Route>
        <Route path='finance' element={<Rootlayout/>}>
          <Route path='commissions' element={<RequireAdminPermissions permissions={['finance:view', 'reports:view']}><AdminCommissionsWorkspace/></RequireAdminPermissions>} />
          <Route path='payouts' element={<RequireAdminPermissions permissions={['finance:view', 'finance:manage']}><WithdrawalsPage/></RequireAdminPermissions>} />
          <Route path='refunds' element={<RequireAdminPermissions permissions={['finance:view', 'finance:manage']}><AdminRefundsWorkspace/></RequireAdminPermissions>} />
          <Route path='service-charge' element={<RequireAdminPermissions permissions={['finance:view', 'reports:view']}><AdminServiceChargeWorkspace/></RequireAdminPermissions>} />
          <Route path='vendor-settlements' element={<RequireAdminPermissions permissions={['finance:view', 'finance:manage']}><AdminVendorSettlementWorkspace/></RequireAdminPermissions>} />
          <Route path='profitability' element={<RequireAdminPermissions permissions={['finance:view', 'reports:view']}><AdminProfitabilityWorkspace/></RequireAdminPermissions>} />
        </Route>
        <Route path='sellers' element={<Rootlayout/>}>
          <Route path='all' element={<RequireAdminPermissions permissions={['users:view', 'subscriptions:view']}><BloomzonUsersWorkspace/></RequireAdminPermissions>}/>
          <Route path='region' element={<RegionManagement/>}/>
          <Route
            path='business/type'
            element={
              <RequireAdminPermissions permissions={['products:view', 'domains:view']}>
                <BusinessTypeManagement/>
              </RequireAdminPermissions>
            }
          />
          <Route path='country' element={<CountryManagement/>}/>
          <Route path='stores' element={<Rootlayout/>}>
            <Route index element={<RequireAdminPermissions permissions={['users:view', 'users:manage']}><AdminStoreManagementWorkspace/></RequireAdminPermissions>}/>
            <Route path=':storeId' element={<RequireAdminPermissions permissions={['users:view', 'users:manage']}><AdminStoreDetailsWorkspace/></RequireAdminPermissions>}/>
          </Route>
          <Route path='shipping' element={<Rootlayout/>}>
            <Route index element={<Shipping/>}/>
            <Route path='edit/:shipping' element={<ShippingForm/>}/>
          </Route>
          <Route path='withdrawals' element={<RequireAdminPermissions permissions={['finance:view', 'finance:manage']}><WithdrawalsPage/></RequireAdminPermissions>}/>
          <Route path=':seller' element ={<RequireAdminPermissions permissions={['users:view', 'subscriptions:view']}><SellerDetails/></RequireAdminPermissions>}/>
          <Route path='paymentOptions' element={<Rootlayout/>}>
           <Route
             index
             element={
               <RequireAdminPermissions permissions={['users:view', 'users:manage', 'finance:view']}>
                 <PaymentOptionsPage/>
               </RequireAdminPermissions>
             }
           />
           <Route
             path=':paymentOptions'
             element={
               <RequireAdminPermissions permissions={['users:view', 'users:manage', 'finance:view']}>
                 <PaymentOptionsDetails/>
               </RequireAdminPermissions>
             }
           />
          </Route>
          <Route path='business' element={<Rootlayout/>}>
            <Route
              path=':business'
              element={
                <RequireAdminPermissions permissions={['users:view', 'users:manage', 'subscriptions:view']}>
                  <SellerBusiness/>
                </RequireAdminPermissions>
              }
            />
          </Route>
          <Route path='services' element={<Rootlayout/>}>
            <Route path='elite' element={<Rootlayout/>}>
              <Route index element={<Elite/>}/>
              <Route path=':eliteUsers' element={<EliteDetails/>}/>
              <Route path='videos' element={<EliteVideos/>}/>
             </Route>
             <Route path='reels' element={<Rootlayout/>}>
                <Route index element={<ReelUserManagementPage/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='reels'
                      serviceTitle='B-Reels Analytics'
                      serviceDescription='Track reel-service earnings growth, seller coverage, and monthly reel activity.'
                    />
                  }
                />
                <Route path='orders' element={<ReelsOrdersPage/>}/>
                <Route path=':reels' element={<ReelUserDetailsPage/>}/>
             </Route>
             <Route path='tv' element={<Rootlayout/>}>
                <Route index element={<AdminTVRequests/>}/>
                <Route path='settings' element={<BloomzonTVSettings/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='tv'
                      serviceTitle='B-TV Analytics'
                      serviceDescription='Operational analytics for the TV request service, including earnings growth and ranked sellers.'
                    />
                  }
                />
                <Route path='orders' element={<ReelsOrdersPage/>}/>
                <Route path=':reels' element={<ReelUserDetailsPage/>}/>
             </Route>
             <Route path='health-care' element={<Rootlayout/>}>
                <Route index element={<HealthCareUserManagement/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='bloomzon_healthcare'
                      serviceTitle='Bloomzon Health Care Analytics'
                    />
                  }
                />
                {/* <Route path=':reels' element={<ReelUserDetailsPage/>}/> */}
             </Route>
             <Route path='food' element={<Rootlayout/>}>
                <Route index element={<Food/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='foods_restaurants'
                      serviceTitle='Foods & Restaurants Analytics'
                    />
                  }
                />
                <Route path=':food' element={<FoodUserDetails/>}/>
             </Route>
             <Route path='used-items' element={<Rootlayout/>}>
                <Route index element={<UsedItemsAdmin/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='used_items'
                      serviceTitle='Used Items Analytics'
                    />
                  }
                />
                <Route path=':used' element={<UsedItemDetails/>}/>
             </Route>
             <Route path='automobile' element={<Rootlayout/>}>
                <Route index element={<AutomobileAdminDashboard/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='automobile_parts'
                      serviceTitle='Automobile & Parts Analytics'
                    />
                  }
                />
                <Route path=':automobile' element={<AutomobileVehicleDetails/>}/>
             </Route>
             <Route path='real-estate' element={<Rootlayout/>}>
                <Route index element={<AdminRealEstateDashboard/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='real_estate'
                      serviceTitle='Real Estate Analytics'
                    />
                  }
                />
                <Route path=':type/:realestate' element={<RealestateAdminDetailView/>}/>
             </Route>
             <Route path='bloomzon-tv' element={<Rootlayout/>}>
                <Route index element={<BloomzonTVAdminDashboard/>}/>
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='bloomzon_tv'
                      serviceTitle='Bloomzon TV Analytics'
                    />
                  }
                />
                <Route path=':type/:realestate' element={<RealestateAdminDetailView/>}/>
             </Route>
             <Route path='live' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='live'
                      serviceTitle='B-Live Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='live'
                      serviceTitle='B-Live Analytics'
                    />
                  }
                />
             </Route>
             <Route path='bidshow' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='bidshow'
                      serviceTitle='B-Bidshow Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='bidshow'
                      serviceTitle='B-Bidshow Analytics'
                    />
                  }
                />
             </Route>
             <Route path='manufacturers' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='manufacturers'
                      serviceTitle='B-Manufacturers Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='manufacturers'
                      serviceTitle='B-Manufacturers Analytics'
                    />
                  }
                />
             </Route>
             <Route path='wholesellers' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='wholesellers'
                      serviceTitle='B-Wholesellers Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='wholesellers'
                      serviceTitle='B-Wholesellers Analytics'
                    />
                  }
                />
             </Route>
             <Route path='trueview' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='trueview'
                      serviceTitle='B-Trueview Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='trueview'
                      serviceTitle='B-Trueview Analytics'
                    />
                  }
                />
             </Route>
             <Route path='logistics' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='logistics'
                      serviceTitle='B-Logistics Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='logistics'
                      serviceTitle='B-Logistics Analytics'
                    />
                  }
                />
             </Route>
             <Route path='expo' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='expo'
                      serviceTitle='B-Expo Analytics'
                    />
                  }
                />
                <Route
                  path='analytics'
                  element={
                    <ServiceAnalyticsWorkspace
                      serviceKey='expo'
                      serviceTitle='B-Expo Analytics'
                    />
                  }
                />
             </Route>
             <Route path='groceries-beverages' element={<Rootlayout/>}>
              <Route index element={<Groceries/>}/>
              <Route
                path='analytics'
                element={
                  <ServiceAnalyticsWorkspace
                    serviceKey='groceries_beverages'
                    serviceTitle='Groceries & Beverages Analytics'
                  />
                }
              />
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
          <Route
            path='all'
            element={
              <RequireAdminPermissions permissions={['users:view', 'users:manage', 'subscriptions:view']}>
                <BloomzonUsersWorkspace/>
              </RequireAdminPermissions>
            }
          />
          <Route path='withdrawals' element={<Navigate to="/dashboard/sellers/withdrawals" replace />}/>
        </Route>
        <Route path='products' element={<Rootlayout/>}>
          <Route
            index
            element={
              <RequireAdminPermissions permissions={['products:view', 'domains:view']}>
                <ProductsPage/>
              </RequireAdminPermissions>
            }
          />
          <Route
            path=':productId'
            element={
              <RequireAdminPermissions permissions={['products:view', 'domains:view']}>
                <ProductDetailsPage/>
              </RequireAdminPermissions>
            }
          />
        </Route>
        <Route path='orders' element={<Rootlayout/>}>
          <Route index element={<Navigate to="/dashboard/orders/products" replace />} />
          <Route
            path='products'
            element={
              <RequireAdminPermissions permissions={['orders:view', 'orders:manage']}>
                <OrdersPage title="Product Orders" orderType="product" />
              </RequireAdminPermissions>
            }
          />
          <Route
            path='food'
            element={
              <RequireAdminPermissions permissions={['orders:view', 'orders:manage']}>
                <FoodOrdersPage/>
              </RequireAdminPermissions>
            }
          />
        </Route>
        <Route path='actions' element={<Rootlayout/>}>
          <Route
            path='referals'
            element={
              <RequireAdminPermissions permissions={['reports:view', 'reports:export']}>
                <Referals/>
              </RequireAdminPermissions>
            }
          />
          <Route path='transaction' element={<MyTransactions/>}/>
          <Route path='profile' element={<ProfilePage/>}/>
          <Route
            path='notifications'
            element={
              <RequireAdminPermissions permissions={['dashboard:view', 'users:view', 'orders:view', 'finance:view']}>
                <Notifications/>
              </RequireAdminPermissions>
            }
          />
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
          <Route
            path='categories'
            element={
              <RequireAdminPermissions permissions={['products:view', 'domains:view']}>
                <BusinessTypeManagement />
              </RequireAdminPermissions>
            }
          />
          <Route
            path='create/categories'
            element={
              <RequireAdminPermissions permissions={['products:view', 'domains:view']}>
                <BusinessTypeManagement initialIntent='create-category' />
              </RequireAdminPermissions>
            }
          />
        </Route>
        <Route path='legal' element={<Rootlayout/>}>
          <Route index element={<LegalHubPage/>} />
          <Route path='terms' element={<LegalDocumentPage documentKey='terms' />} />
          <Route path='privacy' element={<LegalDocumentPage documentKey='privacy' />} />
          <Route path='cookies' element={<LegalDocumentPage documentKey='cookies' />} />
          <Route path='refunds' element={<LegalDocumentPage documentKey='refunds' />} />
          <Route path='country' element={<LegalDocumentPage documentKey='country' />} />
          <Route
            path='notifications'
            element={<LegalDocumentPage documentKey='notifications' />}
          />
        </Route>
        <Route path='others' element={<Rootlayout/>}>
          <Route path='admins' element={<Rootlayout/>}>
            <Route
              index
              element={
                <RequireAdminPermissions permissions={['admins:view', 'admins:manage']}>
                  <Admins/>
                </RequireAdminPermissions>
              }
            />
            <Route
              path='activities'
              element={
                <RequireAdminPermissions permissions={['admins:view', 'admins:manage']}>
                  <AdminActivitiesWorkspace/>
                </RequireAdminPermissions>
              }
            />
            <Route
              path='audit-logs'
              element={
                <RequireAdminPermissions permissions={['admins:view', 'admins:manage']}>
                  <AuditLogs/>
                </RequireAdminPermissions>
              }
            />
            <Route
              path=':adminId'
              element={
                <RequireAdminPermissions permissions={['admins:view', 'admins:manage']}>
                  <AdminActivitiesWorkspace/>
                </RequireAdminPermissions>
              }
            />
            <Route path='messages' element={<Rootlayout/>}>
                <Route
                  index
                  element={
                    <RequireAdminPermissions permissions={['orders:view', 'orders:manage', 'users:view']}>
                      <AdminSupportWorkspace/>
                    </RequireAdminPermissions>
                  }
                />
                <Route
                  path=':conversationId'
                  element={
                    <RequireAdminPermissions permissions={['orders:view', 'orders:manage', 'users:view']}>
                      <AdminSupportWorkspace/>
                    </RequireAdminPermissions>
                  }
                />
            </Route>
            <Route path='banner' element={<AppBannerManagement/>}/>
            <Route path='logistics' element={<LogisticsServices/>}/>
            <Route
              path='roles'
              element={
                <RequireAdminPermissions permissions={['admins:view', 'admins:manage']}>
                  <RoleManagement/>
                </RequireAdminPermissions>
              }
            />
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
