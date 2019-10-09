const model = (function(){

    return {
        getDestinations: async function () {
            let response = await fetch('http://localhost:5000/destinations')
            let data = await response.json()

            return data;
        },    
    
        getStatuses: async function() {
            let response = await fetch('http://localhost:5000/statuses')
            let data = await response.json()

            return data;
        },
    }
})();

export default model;