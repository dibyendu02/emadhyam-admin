import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Verification from "./pages/Verification";
import { Provider } from "react-redux";
import store from "./redux/store";
import Product from "./pages/Product/Product";
import Consultation from "./pages/Consultation";
import Stories from "./pages/Stories";
import User from "./pages/User";
import Order from "./pages/Order";
import Chat from "./pages/Chat";
import ContentVideos from "./pages/videos/contentVideo";
import DietPdf from "./pages/dietPdf";
import UserUpdates from "./pages/UserUpdates";
import SingleUserUpdates from "./pages/SinglUserUpdates";
import YTContentVideos from "./pages/videos/YTcontentVideo";
import SubscriberDiet from "./pages/SubscriberDiet";
import IBSquestions from "./pages/questions/IBSquestions";
import DiabetesQuestions from "./pages/questions/DiabetesQuestions";
import DepressionQuestions from "./pages/questions/DepressionQuestions";
import SubscriberVideos from "./pages/videos/subscriberVideo";
import Retailers from "./pages/Retailers";
import Suppliers from "./pages/Suppliers";
import RecentDeals from "./pages/RecentDeals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verification />,
  },
  // {
  //   path: "/dashboard",
  //   element: <Home />,
  // },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/recent-deals",
    element: <RecentDeals />,
  },
  {
    path: "/consultation",
    element: <Consultation />,
  },
  {
    path: "/userStories",
    element: <Stories />,
  },
  {
    path: "/userUpdates",
    element: <UserUpdates />,
  },
  {
    path: "/userUpdates/:id",
    element: <SingleUserUpdates />,
  },
  {
    path: "/content-videos",
    element: <ContentVideos />,
  },
  {
    path: "/yt-content-videos",
    element: <YTContentVideos />,
  },
  {
    path: "/subscriber-videos",
    element: <SubscriberVideos />,
  },
  {
    path: "/general-diet",
    element: <DietPdf />,
  },
  {
    path: "/subscriber-diet",
    element: <SubscriberDiet />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/IBS-questions",
    element: <IBSquestions />,
  },
  {
    path: "/depression-questions",
    element: <DepressionQuestions />,
  },
  {
    path: "/diabetes-questions",
    element: <DiabetesQuestions />,
  },
  {
    path: "/retailers",
    element: <Retailers />,
  },
  {
    path: "/suppliers",
    element: <Suppliers />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
