import './device_variables.css';
import React, { useEffect, useState } from 'react';

const { tago_device } = require('../../classes/device/device.js');
const { location_apis } = require('../../classes/location/location.js')


function Device_variables(){
  const [account_devices, set_account_devices] = useState([]);
  const [device_variables, set_device_variables] = useState([]);

  const device_methods = new tago_device();
  const location_funcs = new location_apis();

    window.TagoIO.onStart((widget) => {
        window.widget = widget;
    })
    window.TagoIO.ready();





    useEffect( () => {
        device_methods.list()
           .then((resp) => set_account_devices(resp))
           .catch((err) => console.log(err))
    },[])

    
    

    return(
        <>

        <div className='div-mother'>
        <div className='div-filho'>

        <div className='text-div-mother'>
         <h1>HELLO MY FRIEND!</h1>
         <br/>
         <h3>Choose the device that you wish see the variables:</h3>
         </div>
         <div className="input">
                    <select id="devices" className ="devices">
                        {account_devices.map((item) =>{
                          try{
                             return(
                                 <option value={`${item.id},${item.name}`}> {item.name} </option>
                             )
                            }catch(err){
                              console.log(err)
                            }
                                      
                        })}
                    </select>

                    <button onClick={async() =>  { let request = await device_methods.get_device_variables(); set_device_variables(request.filter(obj => obj.variable === "esn")); }}> Show variables</button>
                </div> 



                <div className='data_variables'>

                    
                            

                        <table border="1" className='variable_tables'>
                            <tr>
                                <td>Address</td>
                                <td>Origin</td>
                                <td>Coordinates</td>
                                  
                            </tr>
                            {device_variables.map(data => {

                                setTimeout(() => {// This delay is necessary because firt i need to create an element with the corresponding tag and after i catch the element through of id 
                                    const element_id = data.id;
                                    const scope = data; 

                                    document.getElementById(data.id).addEventListener('change', async function(){
                                      
                                        if(this.value === "MAC"){ 
                                          let element_to_insert_the_new_value = document.getElementsByClassName(element_id)[0];
                                          let mac_coordinates = await location_funcs.get_coordinates_through_mac_datas(["mac0", "mac1", "mac2"],scope); 
                                          element_to_insert_the_new_value.innerText = `${mac_coordinates.lat},${mac_coordinates.lng}`;
                                        }
                                        else if(this.value === "LBS"){console.log("oieeeee")
                                          let element_to_insert_the_new_value = document.getElementsByClassName(element_id)[0];
                                          let lbs_coordinates = await location_funcs.get_coordinates_through_lbs_datas(["lbs0", "lbs1", "lbs2"],scope, scope.metadata.lbs_mode === "LTE" ?"lte" :"gsm" ); 
                                          element_to_insert_the_new_value.innerText = `${lbs_coordinates.lat},${lbs_coordinates.lng}`; 
                                        }
                                        else{ 

                                        }

                                    })

                                },10);
                            
                              return( 
                                <tr>
                                    <td className='data_variable'>{data.metadata.address}</td>
                                    <td className='data_variable'>{data.metadata.origin}</td>

                                    <td className='b'>
                                        <select id={data.id} className ="coordinate-types">
                                            <option>Select the data type that you want to see...</option>
                                            <option value="LBS" >LBS coordinates</option>
                                            <option value="MAC" >MAC coordinates</option>
                                            <option value="GPS" >GPS coordinates</option>
                                        </select>

                                     
                                     </td>
                                     <td className={data.id}></td>

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