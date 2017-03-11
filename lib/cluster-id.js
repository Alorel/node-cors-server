let clusterID = 0;

module.exports = {
    register(id) {
        clusterID = id;
        return module.exports;
    },
    get(){
        return clusterID;
    }
};