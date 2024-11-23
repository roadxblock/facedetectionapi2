

const handleImage = (req, res,db) => {
    const { id } = req.body;
    db('users').select('name').where('id', '=',id).increment('entries',1)
    .returning(['entries','name as nom'])
    .then(data=> {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}
module.exports = {
    handleImage : handleImage
};