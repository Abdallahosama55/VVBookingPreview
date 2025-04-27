import { Col, Result, Row } from 'antd'
import React from 'react'

function NotAvalible() {
  return (
    <div>      <Row
    justify="center"
    align="middle"
    style={{
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    }}
  >
    <Col>
      <Result
        status="info"
        title="Form Not Available"
        subTitle="This form is currently inactive and cannot be filled out at this time. Please check back later."
      />
    </Col>
  </Row></div>
  )
}

export default NotAvalible