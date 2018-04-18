let WS_USER_ARRAY = [];

module.exports.chatServerHandler = (ws) => {
    ws.on('open', () => {
        console.log('Connection is open');
    });

    ws.on('close', () => {
        console.log('___________________disconnected');
        for(let i = WS_USER_ARRAY.length-1 ; i>=0; i--){
            if(WS_USER_ARRAY[i].ws.readyState === WS_USER_ARRAY[i].ws.CLOSED){
                console.log('OFFLINE USER');
                WS_USER_ARRAY.splice(i, 1);
            }
        }
    });

    ws.on('message', (msg) => {

    });
};
