import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@popperjs/core";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";
import RightPanel from "./Components/RightPanel";
import SideBar from "./Components/SideBar";

const App = () => {
	return ( 
		<div className="App d-flex">
			<SideBar />
			<RightPanel />
		</div>
	)
}

export default App;
