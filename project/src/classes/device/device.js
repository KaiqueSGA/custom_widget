const {Account, Device} = require('@tago-io/sdk');
const account = new Account({token:"191363cf-b92e-4700-8d9f-ca21d9e9783b"});

export class tago_device{

    async list(){//public method

      return new Promise((resolve, reject) => {
        account.devices.list()
        .then((resp) => resolve(resp) )
        .catch((err) => reject(err) );          
      })  

   }



   async get_device_id(select_value){//private method
       const device_id = select_value.split(",")[0];console.log(device_id)
       return device_id;
   }



   async get_select_content(){//private method
       const select = document.getElementById("devices");
       let select_value = select.options[select.selectedIndex].value;
       
       return select_value;
   }



   async get_device_token(device_id){//private method
       const device_token = await account.devices.paramList(device_id);
       return device_token.find(param => param.key === "device_token").value;
   }



   async get_device_variables(){//public method
       let select_value = await this.get_select_content();
       let device_id = await this.get_device_id(select_value);
       let device_token = await this.get_device_token(device_id);

       const my_device = new Device({token: device_token });
       const request = await my_device.getData({qty: 500});
       
  
       return request;
   }
}

