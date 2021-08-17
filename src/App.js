import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.css";
import RightPanel from "./Components/RightPanel";
import SideBar from "./Components/SideBar";
import toPath from 'element-to-path';


const App = () => {
	return ( 
		<div className="App d-flex">
			<SideBar />
			<RightPanel />
		</div>
	)
}

export default App;
