require('!style!css!less!bootstrap/less/bootstrap.less');
import React,{Component,PropTypes} from 'react';
import GoogleMapReact from 'google-map-react';
import MyGreatPlace from './maps/my_great_place.js';
import {Table,Panel,Button,Form,FormGroup,ControlLabel,FormControl,HelpBlock,Modal,Grid,Col,Row,Pagination} from 'react-bootstrap';
require('isomorphic-fetch');
require('es6-promise').polyfill();

class AddressForm extends Component{
    constructor(props){
        super(props);
        this.handleNameChange=this.handleNameChange.bind(this);
        this.handleBoroughChange=this.handleBoroughChange.bind(this);
        this.handleCuisineChange=this.handleCuisineChange.bind(this);
        this.getNameValidationState=this.getNameValidationState.bind(this);
        this.getBoroughValidationState=this.getBoroughValidationState.bind(this);
        this.getCuisineValidationState=this.getCuisineValidationState.bind(this);
        this.searchRestaurant=this.searchRestaurant.bind(this);
        this.createNewRestaurant=this.createNewRestaurant.bind(this);
        this.open=this.open.bind(this);
        this.close=this.close.bind(this);
        
        this.state={Name:'',Borough:'',Cuisine:'',restaurant:[],sels:{Name:''},showModal:false};
    }
    
    componentWillMount(){
        this.state={
            restaurant:[{name:'',borough:'',cuisine:''}],
            sels:{Name:''},showModal:false  
        };
    }
    
    searchRestaurant(){
        fetch("",{
            method:"POST",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name:this.state.Name,borough:this.state.Borough,cuisine:this.state.Cuisine})
        }).then(
            function(res){debugger;
                if(res.status>=400){
                    throw new Error("Bad Response");
                }
                return res.json();
            }.bind(this)
        ).then(
            function(st){
                this.setState({restaurant:st})
            }.bind(this)
        )
        return false;
    }
    
    
    handleNameChange(e){
        this.setState({Name:e.target.value});
    }
    handleBoroughChange(e){
        this.setState({Borough:e.target.value});
    }
    handleCuisineChange(e){
        this.setState({Cuisine:e.target.value});
    }
    
    getNameValidationState(){
        if(this.state.Name && this.state.Name.length<5){
            return 'error';
        }   
    }
    
    getBoroughValidationState(){
        if(this.state.Borough && this.state.Borough.length<5){
            return 'error';
        }
    }
    
    getCuisineValidationState(){
        if(this.state.Cuisine && this.state.Cuisine.length<5){
            return 'error';
        }
    }
    
    close(){
        this.setState({showModal:false});
    }
    
    open(e){
        var selectedItem=null;
        if(!e){
            selectedItem={Name:'',Borough:'',Cuisine:''};
        }else{
            selectedItem=this.state.restaurant.find(function(t){
                return t.restaurant_id==e;
            });
            this.props.greatPlaceCoords.lat=selectedItem.address.coord[1];
            this.props.greatPlaceCoords.lng=selectedItem.address.coord[0];
            this.props.center[0]=selectedItem.address.coord[1];
            this.props.center[1]=selectedItem.address.coord[0];
            
        }
        this.setState({showModal:true,sels:selectedItem});
    }
    
    createNewRestaurant(){
        this.open();
    }
    
    render(){
        return(
            <div>
                <Panel header="Filters">
                    <Form inline>
                        <FormGroup controlId="formInLineName" validationState={this.getNameValidationState()}>
                            <ControlLabel>Name</ControlLabel>
                            {' '}
                            <FormControl type="text" placeholder="" value={this.state.Name} onChange={this.handleNameChange} />
                        </FormGroup>
                        <FormGroup controlId="formInLineName" validationState={this.getNameValidationState()}>
                            <ControlLabel>Borough</ControlLabel>
                            {' '}
                            <FormControl type="text" placeholder="" value={this.state.Borough} onChange={this.handleBoroughChange} />
                        </FormGroup>
                        <FormGroup controlId="formInLineName" validationState={this.getNameValidationState()}>
                            <ControlLabel>Cuisine</ControlLabel>
                            {' '}
                            <FormControl type="text" placeholder="" value={this.state.Cuisine} onChange={this.handleCuisineChange} />
                        </FormGroup>
                        {'  '}
                        <Button type="button" onClick={this.searchRestaurant} bsStyle="info">
                        Search
                        </Button>
                        {'  '}
                        <Button type="button" onClick={this.createNewRestaurant} bsStyle="primary">
                        Add New Restaurant
                        </Button>                        
                    </Form>
                </Panel>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                        <th>Restaurant ID</th>
                        <th>Name</th>
                        <th>borough</th>
                        <th>cuisine</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.restaurant.map(function(result){
                                return(
                                  <tr key={result.restaurant_id}>
                                    <td><a href="#" onClick={this.open.bind(null,result.restaurant_id)}>{result.restaurant_id}</a></td>
                                    <td>{result.name}</td>
                                    <td>{result.borough}</td>
                                    <td>{result.cuisine}</td>
                                  </tr>  
                                );
                            }.bind(this))
                        }
                    </tbody>
                </Table>
                <Pagination
                bsSize="small"
                items={10}
                activePage={1}
                onSelect={this.handleSelect} />
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        Edit Restaurant
                    </Modal.Header>
                    <Modal.Body>
                        <Grid>
                            <Row className="show-grid">
                                <Col xs={8} md={4}>
                                    <form>
                                        <FormGroup controlId="formControl1">
                                            <ControlLabel>RestaurantID</ControlLabel>{'    '}
                                            <ControlLabel>{this.state.sels.restaurant_id}</ControlLabel>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Name</ControlLabel>{' '}
                                            <FormControl type="text" value={this.state.sels.name}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Borough</ControlLabel>{' '}
                                            <FormControl type="text" value={this.state.sels.borough}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Cuisine</ControlLabel>{' '}
                                            <FormControl type="text" value={this.state.sels.cuisine}/>
                                        </FormGroup>
                                        {' '}
                                        <Button type="button" onClick={this.searchRestaurant} bsStyle="success">
                                        Save
                                        </Button>
                                        {' '}
                                        <Button type="button" onClick={this.close} bsStyle="warning">
                                        Cancel
                                        </Button>
                                    </form>
                                </Col>
                                <Col xs={8} md={4}>
                                    <div style={{width:'100%',height:'400'}}>
                                        <GoogleMapReact
                                            bootStrapURLKeys={{key:''}}
                                            center={this.props.center}
                                            zoom={this.props.zoom}>
                                            <MyGreatPlace lat={59.938043} lng={30.337157} text={'A'}/>
                                            <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'}/>
                                        </GoogleMapReact>
                                            
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
    
}

AddressForm.PropTypes={
    center:PropTypes.array,
    zoom:PropTypes.number,
    greatPlaceCoords:PropTypes.any
}

AddressForm.defaultProps={
    center:[59.938043,30.337157],
    zoom:15,
    greatPlaceCoords:{lat:59.938043,lng:30.337157}
}

export default AddressForm;