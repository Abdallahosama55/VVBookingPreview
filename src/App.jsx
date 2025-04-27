import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TravelAgentForm from './pages/TravelAgentForm';
import MainLayout from './layout/MainLayout';

function App() {
  return (
<Router>
      <MainLayout>
        <Routes>
          <Route path="/forms">
            {/* index route for /forms */}
            <Route index element={<TravelAgentForm />} />
            {/* dynamic route for /forms/:slug */}
            <Route path=":slug" element={<TravelAgentForm />} />
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
