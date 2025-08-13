import "./App.css";
import NotificationProvider from "./notifications";
import RoutesProvider from "./router";
import LayoutProvider from "./layout";

function App() {
  return (
    <NotificationProvider>
      <RoutesProvider>
        <LayoutProvider />
      </RoutesProvider>
    </NotificationProvider>
  );
}

export default App;
