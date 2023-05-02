import './device_variables.css';
import React, { useEffect, useState } from 'react';


const { tago_device } = require('../../classes/device/device.js');
const { location_apis } = require('../../classes/location/location.js')


function Device_variables(){
  const [device_variables, set_device_variables] = useState([]);

  const device_methods = new tago_device();
  const location_funcs = new location_apis();


  useEffect(() => {console.log("oiii")
    window.TagoIO.onStart( async(widget) => {
      window.widget = widget;

      let device_id = widget.display.variables[0].origin.id;
      let request = await device_methods.get_device_variables(device_id); 
      set_device_variables(request); 
  })
  window.TagoIO.ready(); 
  },[])


    
    
    


   function add_0_to_left(value){

      if( String(value).length === 1 ){
        return "0" + value;
      }else{
        return value;
      }

   }



    return(
        <>

        <div className='div-mother'>
        <div className='div-filho'>

      <div className='text-div-mother'>
         <h1>See all variables that the selected device sent!</h1>
         <br/>
        </div>
       
                <div className='data_variables'>

                        <table border="1" className='variable_tables'>
                            <tr>
                                <td>Origin</td>
                                <td>Date and Time</td>
                                <td>Coordinates</td>
                                  
                            </tr>
                            {device_variables.map(data => { 

                                setTimeout(() => {// This delay is necessary because firt i need to create an element with the corresponding tag and after i catch the element through of id 
                                    const element_id = data.id;
                                    const scope = data; 

                                    document.getElementById(data.id).addEventListener('change', async function(){console.log(this.value)
                                      
                                        if(this.value === "MAC"){ 
                                          let element_to_insert_the_new_value = document.getElementsByClassName(element_id)[0];
                                          let element_to_insert_the_address = document.getElementsByClassName(element_id)[1]; 

                                          console.log(element_to_insert_the_new_value, element_to_insert_the_address)
                                          let mac_coordinates = await location_funcs.get_coordinates_through_mac_datas(["mac0", "mac1", "mac2"],scope); 
                                          let address = mac_coordinates.lat === 0 || mac_coordinates.lng === 0 ? "invalid data" :await location_funcs.get_address_through_coordinates(mac_coordinates.lat, mac_coordinates.lng);console.log(address)
                                         
                                          element_to_insert_the_new_value.innerText = `${mac_coordinates.lat},${mac_coordinates.lng}`;
                                          element_to_insert_the_address.innerText = address;
                                        }

                                        else if(this.value === "LBS"){
                                          let element_to_insert_the_new_value = document.getElementsByClassName(element_id)[0];
                                          let element_to_insert_the_address = document.getElementsByClassName(element_id)[1];//Position 1 because i yhave 2 elements with the same tags, the second element will render the address

                                          console.log(element_to_insert_the_new_value, element_to_insert_the_address)
                                          let lbs_coordinates = await location_funcs.get_coordinates_through_lbs_datas(["lbs0", "lbs1", "lbs2"],scope, scope.metadata.lbs_mode === "LTE" ?"lte" :"gsm" ); 
                                          let address =  lbs_coordinates.lat === 0 || lbs_coordinates.lng === 0 ? "invalid data" :await location_funcs.get_address_through_coordinates(lbs_coordinates.lat, lbs_coordinates.lng);console.log(address)
                                         
                                          element_to_insert_the_new_value.innerText = `${lbs_coordinates.lat},${lbs_coordinates.lng}`; 
                                          element_to_insert_the_address.innerText = address;
                                        }

                                        else{ 
                                          let element_to_insert_the_new_value = document.getElementsByClassName(element_id)[0];
                                          let element_to_insert_the_address = document.getElementsByClassName(element_id)[1]; 

                                          console.log(element_to_insert_the_new_value, element_to_insert_the_address)
                                          let gps_coordinates = { lat:scope.metadata.lat, lng:scope.metadata.lon };
                                          let address = gps_coordinates.lat === 0 || gps_coordinates.lng === 0 ? "invalid data" :await location_funcs.get_address_through_coordinates(gps_coordinates.lat, gps_coordinates.lng);console.log(address)
                                          
                                          element_to_insert_the_new_value.innerText = `${gps_coordinates.lat},${gps_coordinates.lng}`;
                                          element_to_insert_the_address.innerText = address;
                                        
                                        }

                                    })

                                },10);
                            
                              return( 
                                <tr>
                                    <td className='data_variable'>{data.metadata.origin}</td>

                                     <td>{`${ add_0_to_left((data.time.getMonth()) + 1)  }/${ add_0_to_left(data.time.getDate()) }/${ add_0_to_left(data.time.getFullYear()) } ${ add_0_to_left(data.time.getHours()) }:${ add_0_to_left(data.time.getMinutes()) }:${ add_0_to_left(data.time.getSeconds()) }`}</td>  

                                    <td className='b'>{/* Origin */}
                                        <select id={data.id} className ="coordinate-types">
                                            <option>Select the data type that you want to see...</option>
                                            <option value="LBS" >LBS coordinates</option>
                                            <option value="MAC" >MAC coordinates</option>
                                            <option value="GPS" >GPS coordinates</option>
                                        </select>

                                     
                                     </td>

                                     <td className={data.id}></td>{/* Date and time */}
                                     <td className={data.id}></td>{/* Coordinates */}

                                </tr>
                              )

                               
  


                            })}

                        </table>
                        
                            
                    
                </div>




                </div> 


           

            </div>         
         
        </>
    )
}



export { Device_variables };