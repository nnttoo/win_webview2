
import prompts from 'prompts';
import { WW2Builder } from './builder_deploy';
import { ww2Init } from './builder_init';

type Choise = {[key : string] :  () => any }

let ww2Choise: Choise  = { 
    "init_ww2" : async () => {
            await ww2Init();
        },
    deploy : async ()=>{

    } 
}

type promChoise = {
    title : string,
    value : ()=>any
}

export async function buildForServer() {
    const response = await prompts({
        type: 'select',
        name: 'menu',
        message: 'Pilih menu',
        choices:  (()=>{
            let result : promChoise [] = [];

            for(let item in ww2Choise){
                let val = ww2Choise[item];

                result.push({
                    title :  item,
                    value : val
                });
            }

            return result;
            

        })(),
    });
    if (response && response.menu) {

        response.menu();
    }
}
console.log("ww2 version : v5 \n\n"); 
const args = process.argv.slice(2);


if (args.length > 0) {

    let argument = args[0] as string;
    if(argument.startsWith("--")){
        argument = argument.substring(2);
    }

    console.log(argument);
    if(ww2Choise[argument]){
        ww2Choise[argument]();
    } 

} else {

    buildForServer();
}
