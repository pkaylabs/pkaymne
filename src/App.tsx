import "./App.css";
import NotificationProvider from "./notifications";
import RoutesProvider from "./router";


function App() {
  return (
    <NotificationProvider>
      <RoutesProvider>
        {/* <LayoutProvider /> */}
      </RoutesProvider>
    </NotificationProvider>
  );
}

export default App;
