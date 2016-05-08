require('!style!css!less!bootstrap/less/bootstrap.less');
import React,{Component,PropTypes} from 'react';
import AddressForm from './Components/AddressForm';
import {Navbar,Nav,NavItem,NavDropdown,MenuItem,Grid,Col,Row,Panel} from 'react-bootstrap';

class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
          <Grid>
            <Row className='show-grid'>
                <Col xs={8} md={12}>
                    <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                        Restaurant Management Tool
                        </Navbar.Brand>
                    </Navbar.Header>
                    </Navbar>
                </Col>
                <Col xs={8} md={12}>
                    <Panel header="Search restaurants">
                        <AddressForm />
                    </Panel>
                </Col>
            </Row>
          </Grid>  
        );
    }
}

export default App;