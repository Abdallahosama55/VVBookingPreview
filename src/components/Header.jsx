import React, { useState } from 'react';
import { Layout, Row, Col, Menu, Button, Space, Drawer } from 'antd';
import { GlobalOutlined, MenuOutlined } from '@ant-design/icons';
import Logo from '../assets/logo.png';

const { Header } = Layout;

const AppHeader = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'ar'
  const [currency, setCurrency] = useState('usd'); // 'usd' or 'eur'

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'usd' ? 'eur' : 'usd'));
  };

  return (
    <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Row align="middle" justify="space-between" wrap>
        {/* LOGO */}
        <Col xs={18} md={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={Logo} alt="logo" height={35} />
          </div>
        </Col>

        {/* NAV LINKS - Hidden on Small Screens */}
        <Col xs={0} md={12}>
          <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none', justifyContent: 'center' }}>
            <Menu.Item key="explore">Explore</Menu.Item>
            <Menu.Item key="moments">Moments</Menu.Item>
            <Menu.Item key="experts">Travel Experts</Menu.Item>
            <Menu.Item key="metaverse">Metaverse</Menu.Item>
          </Menu>
        </Col>

        {/* ACTIONS */}
        <Col xs={0} md={6}>
          <Space>
            {/* Toggle Language & Currency */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f5f6fa',
                borderRadius: 24,
                padding: '4px 12px',
                gap: 8,
              }}
            >
              <Button
                type="text"
                icon={<GlobalOutlined />}
                style={{ padding: '0 8px', color: '#5b5b5b' }}
                onClick={toggleLanguage}
              >
                {language.toUpperCase()}
              </Button>

              <div style={{ height: '24px', width: '1px', backgroundColor: '#ccc' }} />

              <Button
                type="text"
                style={{ padding: '0 8px', color: '#5b5b5b' }}
                onClick={toggleCurrency}
              >
                {currency.toUpperCase()}
              </Button>
            </div>

            <Button
              type="primary"
              style={{
                background: 'linear-gradient(to right, #a020f0, #c850c0)',
                borderColor: '#a020f0',
              }}
              shape="round"
            >
              Sign In
            </Button>
          </Space>
        </Col>

        {/* Mobile Menu Button */}
        <Col xs={6} md={0} style={{ textAlign: 'right' }}>
          <Button icon={<MenuOutlined />} type="text" onClick={() => setOpenDrawer(true)} />
        </Col>
      </Row>

      {/* Drawer for Mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Menu mode="vertical" selectable={false}>
          <Menu.Item key="explore">Explore</Menu.Item>
          <Menu.Item key="moments">Moments</Menu.Item>
          <Menu.Item key="experts">Travel Experts</Menu.Item>
          <Menu.Item key="metaverse">Metaverse</Menu.Item>
        </Menu>

        <div style={{ marginTop: 20 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              icon={<GlobalOutlined />}
              type="text"
              onClick={toggleLanguage}
            >
              {language.toUpperCase()}
            </Button>

            <Button block type="text" onClick={toggleCurrency}>
              {currency.toUpperCase()}
            </Button>

            <Button
              block
              type="primary"
              style={{
                background: 'linear-gradient(to right, #a020f0, #c850c0)',
                borderColor: '#a020f0',
              }}
              shape="round"
            >
              Sign In
            </Button>
          </Space>
        </div>
      </Drawer>
    </Header>
  );
};

export default AppHeader;
