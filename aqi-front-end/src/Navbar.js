import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Headerbar()
{
    return (
        <>
        <Navbar bg="transparent" variant="light">
        <Container>
          <Navbar.Brand href="/">AQI Visualizer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/visualize">Visualize</Nav.Link>
            <Nav.Link href="/predict">Predict</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      </>
    )
}

export default Headerbar;