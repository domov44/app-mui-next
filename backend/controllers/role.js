const Role = require('../models/role');

exports.getRole = async (req, res) => {
    try {
        const roles = await Role.findAll({
            attributes: ['id', 'label'],
        });

        res.json(roles);

    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des rôles', details: error.message });
    }
};