import { Layout, Button } from 'antd';
import Header from '../components/Header';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout>
      <Header />
      <Content style={{ padding: '2rem', minHeight: '100vh', background: '#f5fafd' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
