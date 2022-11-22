exports.adapterRequest = (req = {}) => {
    return Object.freeze({
        path: req.path,
        method: req.method,
        pathParam: req.params,
        queryParams: req.query,
        body: req.body
    });
}
