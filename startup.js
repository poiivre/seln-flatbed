import * as alt from 'alt';
import game from 'natives';
import * as native from 'natives';


alt.on('keyup', (key) => {

    if ( key == 71 && alt.Player.local.vehicle && native.getEntityModel(alt.Player.local.vehicle.scriptID) == native.getHashKey('flatbed') ) { 
        alt.emitServer('seln:flatbed:gettowedvehicleslist');
    }

});

alt.onServer('seln:flatbed:sendtowedvehicleslist', (list) => {

    if (list == '') {

        alt.emitServer('seln:flatbed:getvehicleslist');

    } else {

        let found = false
        list.forEach(tow => {
            
            if ( tow.flatbed && tow.flatbed == alt.Player.local.vehicle.scriptID ) {
                    
                native.attachEntityToEntity(tow.towed, tow.flatbed, 20, -0.5, -13.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 20, true)
                native.detachEntity(tow.towed, true, true)
                alt.emitServer('seln:flatbed:removetow', tow);
                found = true

            }
        });

        if (!found) {
            alt.emitServer('seln:flatbed:getvehicleslist');
            
        }
    }


});

alt.onServer('seln:flatbed:sendvehicleslist', (list) => {

    let j = alt.Player.local.scriptID;
    let jcoords = native.getEntityCoords(j, true);
    let found = false

    list.forEach(veh => {
        if (veh.scriptID !=0) {

            let vehcoords = native.getEntityCoords(veh.scriptID)
            let dist = native.getDistanceBetweenCoords(jcoords.x, jcoords.y, jcoords.z, vehcoords.x, vehcoords.y, vehcoords.z, true);

            if ( !found && ( dist <= 10.0 && dist >= 8.0 && dist != 0 ) ) {
            
                native.attachEntityToEntity(veh.scriptID, alt.Player.local.vehicle.scriptID, 20, -0.5, -5.5, 1.0, 0.0, 0.0, 0.0, true, false, false, false, 10, true)                
                alt.emitServer('seln:flatbed:addtow', alt.Player.local.vehicle.scriptID, veh.scriptID);
                found = true
            
            }


        }
    });

    

});