import './device_variables.css';
import React, { useEffect, useState } from 'react';
const {Account, Device, Services} = require('@tago-io/sdk');



function Device_variables(){
  const [device, set_device] = useState([]);
  const [device_variables, set_device_variables] = useState([]);
  const account = new Account({token:"191363cf-b92e-4700-8d9f-ca21d9e9783b"});

    window.TagoIO.onStart((widget) => {
        window.widget = widget;
    })
    window.TagoIO.ready();


    
    async function list_devices(){
         await account.devices.list()
                .then((resp) => {set_device(resp); console.log(resp)} )
                .catch((err) => console.log(err));
    }



    async function get_device_id(select_value){
        const device_id = select_value.split(",")[0];console.log(device_id)
        return device_id;
    }



    async function get_select_content(){
        const select = document.getElementById("devices");
        let select_value = select.options[select.selectedIndex].value;
        
        return select_value;
    }



    async function get_device_token(device_id){
        const device_token = await account.devices.paramList(device_id);
        return device_token.find(param => param.key === "device_token").value;
    }



    async function get_device_variables(){
        let select_value = await get_select_content();
        let device_id = await get_device_id(select_value);console.log(device_id);
        let device_token = await get_device_token(device_id);console.log(device_token);

        const my_device = new Device({token: device_token });
        const request = await my_device.getData({qty: 500});
        set_device_variables(request.filter(obj => obj.variable === "esn"));console.log(request.filter(obj => obj.variable === "esn"))

        return request;
    }


    useEffect(() => {
        list_devices()
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
                        {device.map((item) =>{
                          try{
                             return(
                                 <option value={`${item.id},${item.name}`}> {item.name} </option>
                             )
                            }catch(err){
                              console.log(err)
                            }
                                      
                        })}
                    </select>

                    <button onClick={() => get_device_variables()}> Show variables</button>
                </div> 



                <div className='data_variables'>

                    
                            

                        <table border="1" className='variable_tables'>
                            <tr>
                                <td>Coordinates</td>
                                <td>Link</td>
                                <td>Origin</td>
                                <td>Address</td>    
                            </tr>
                            {device_variables.map(data => {
                              return( 
                                <tr>
                                    <td className='data_variable'>{data.metadata.lat},{data.metadata.lon}</td>
                                    <td className='data_variable'>{data.metadata.link}</td>
                                    <td className='data_variable'>{data.metadata.origin}</td>
                                    <td className='data_variable'>{data.metadata.address}</td>
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